import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { paymentService } from '../services/paymentService';
import { orderService } from '../services/orderService';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Please login to proceed with checkout</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const total = getTotal();

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const userName = (user as any).fullName || (user as any).ownerName || 'Customer';
      const userPhone = (user as any).mobileNumber || '000000000';

      await paymentService.openPayment(
        total,
        user.email,
        userName,
        userPhone,
        async (response: any) => {
          // Payment successful
          try {
            // Create orders for each cart item
            for (const item of items) {
              await orderService.createOrder({
                client_id: user.id,
                product_id: item.product.id,
                quantity: item.quantity,
                total_price: item.product.price * item.quantity,
                status: 'pending',
              });
            }

            clearCart();
            setLoading(false);
            navigate('/marketplace', {
              state: { message: 'Order placed successfully! Check your email for details.' },
            });
          } catch (err: any) {
            setError('Failed to create order. Please contact support.');
            setLoading(false);
          }
        },
        (error: any) => {
          setError(error.message || 'Payment failed. Please try again.');
          setLoading(false);
        },
        items
      );
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/marketplace')}
            className="flex items-center text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-500"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Marketplace
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add some items to your cart before checking out
            </p>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ₹{item.product.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Checkout Summary */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                  Checkout
                </h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="font-medium text-gray-900 dark:text-white">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax (5%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₹{(total * 0.05).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    ₹{(total + total * 0.05).toLocaleString()}
                  </span>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>

                <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-4">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
