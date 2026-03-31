import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard, Truck, Shield, CheckCircle2, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotal, getCartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    fullName: (user as any)?.fullName || '',
    phone: (user as any)?.mobileNumber || '',
    address: '',
    city: '',
    pinCode: '',
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const subtotal = getTotal();
  const deliveryFee = subtotal > 999 ? 0 : 79;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate order placement
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
    }, 500);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Placed! 🎉</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your order has been placed successfully. The artisan will be notified and your items will be prepared for delivery.
          </p>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <p className="text-sm text-orange-800 dark:text-orange-300 font-medium">
              Order ID: #ART-{Date.now().toString().slice(-8)}
            </p>
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
              Payment: {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI' : 'Card'} — ₹{total.toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/marketplace')}
              className="flex-1 bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400">Discover beautiful handcrafted products from local artisans</p>
          <Link
            to="/marketplace"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate(-1)} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Shopping Cart ({getCartCount()} items)
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear All
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-start space-x-4 hover:shadow-md transition-shadow"
              >
                <img
                  src={item.product.images?.[0]}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {item.product.shopName || 'Artisan Shop'}
                  </p>
                  {item.product.category && (
                    <span className="inline-block text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 px-2 py-0.5 rounded-full mt-1">
                      {item.product.category}
                    </span>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{item.product.price?.toLocaleString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    <Truck className="h-3.5 w-3.5 mr-1" /> Delivery
                  </span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>GST (5%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-gray-900 dark:text-white font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {deliveryFee === 0 && (
                <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <p className="text-xs text-green-700 dark:text-green-400 font-medium">🎉 Free delivery on orders above ₹999</p>
                </div>
              )}

              {!showCheckout ? (
                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                      return;
                    }
                    setShowCheckout(true);
                  }}
                  className="w-full mt-6 bg-orange-600 text-white font-semibold py-3.5 rounded-lg hover:bg-orange-700 transition-all transform hover:scale-[1.02] shadow-md flex items-center justify-center"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Checkout
                </button>
              ) : (
                <form onSubmit={handlePlaceOrder} className="mt-6 space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <Package className="h-4 w-4 mr-2" /> Delivery Details
                  </h4>

                  <input name="fullName" value={formData.fullName} onChange={handleInputChange} required
                    placeholder="Full Name" className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                  <input name="phone" value={formData.phone} onChange={handleInputChange} required
                    placeholder="Phone Number" className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                  <input name="address" value={formData.address} onChange={handleInputChange} required
                    placeholder="Delivery Address" className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                  <div className="grid grid-cols-2 gap-2">
                    <input name="city" value={formData.city} onChange={handleInputChange} required
                      placeholder="City" className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                    <input name="pinCode" value={formData.pinCode} onChange={handleInputChange} required
                      placeholder="PIN Code" className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>

                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center pt-2">
                    <CreditCard className="h-4 w-4 mr-2" /> Payment Method
                  </h4>

                  <div className="space-y-2">
                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-orange-300'}`}>
                      <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="sr-only" />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-orange-600' : 'border-gray-400'}`}>
                        {paymentMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-orange-600" />}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">📱 UPI Payment</span>
                    </label>

                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-orange-300'}`}>
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="sr-only" />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === 'card' ? 'border-orange-600' : 'border-gray-400'}`}>
                        {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-orange-600" />}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">💳 Credit/Debit Card</span>
                    </label>

                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-orange-300'}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="sr-only" />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-orange-600' : 'border-gray-400'}`}>
                        {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-orange-600" />}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">💵 Cash on Delivery</span>
                    </label>
                  </div>

                  {paymentMethod === 'upi' && (
                    <input name="upiId" value={formData.upiId} onChange={handleInputChange} required
                      placeholder="Enter UPI ID (e.g., name@upi)" className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-2">
                      <input name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} required
                        placeholder="Card Number" maxLength={19} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                      <div className="grid grid-cols-2 gap-2">
                        <input name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} required
                          placeholder="MM/YY" maxLength={5} className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                        <input name="cardCvv" value={formData.cardCvv} onChange={handleInputChange} required
                          placeholder="CVV" maxLength={4} type="password" className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <Shield className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                    Your payment details are encrypted and secure
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-semibold py-3.5 rounded-lg hover:bg-green-700 transition-all transform hover:scale-[1.02] shadow-md"
                  >
                    Place Order — ₹{total.toLocaleString()}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ← Back to cart
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
