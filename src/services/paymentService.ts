import { orderService } from './orderService';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: any;
  theme?: {
    color?: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const paymentService = {
  async loadRazorpayScript() {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  async createOrder(amount: number, currency: string = 'INR') {
    try {
      // In production, call your backend to create Razorpay order
      // For now, we'll use client-side creation
      const response = await fetch('/api/orders/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to paise
          currency,
        }),
      });

      const data = await response.json();
      return { orderId: data.id, error: null };
    } catch (error: any) {
      return { orderId: null, error: error.message };
    }
  },

  async openPayment(
    amount: number,
    userEmail: string,
    userName: string,
    userPhone: string,
    onSuccess: (response: any) => void,
    onError: (error: any) => void,
    cartItems?: any[]
  ) {
    try {
      const scriptLoaded = await this.loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
      if (!razorpayKey) {
        throw new Error('Razorpay key not configured');
      }

      // Create Razorpay order
      const { orderId, error: orderError } = await this.createOrder(amount);
      if (orderError || !orderId) throw new Error(orderError || 'Failed to create order');

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        name: 'Artisan Marketplace',
        description: 'Purchase handcrafted products',
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // Verify payment and create order in database
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              onSuccess(response);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            onError(error);
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },
        theme: {
          color: '#ea580c', // Orange color from the app
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on('payment.failed', (response: any) => {
        onError(new Error(response.error.description));
      });
    } catch (error: any) {
      onError(error);
    }
  },

  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    try {
      // In production, verify signature on backend
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        }),
      });

      const data = await response.json();
      return { verified: data.success, error: data.error || null };
    } catch (error: any) {
      return { verified: false, error: error.message };
    }
  },
};
