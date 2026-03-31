import React, { useState, useEffect } from 'react';
import { Package, Clock, XCircle, CheckCircle2, Truck, AlertTriangle, AlertCircle } from 'lucide-react';
import { apiService } from '../services/apiService';

interface OrderItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    images: string[];
    price: number;
    shopName?: string;
  };
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled' | 'shipped';
  createdAt: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiService.getOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancellingId(orderId);
      await apiService.cancelOrder(orderId);
      
      // Update local state to reflect cancellation
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'cancelled' } : order
      ));
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Clock className="w-3.5 h-3.5 mr-1" /> Pending
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Truck className="w-3.5 h-3.5 mr-1" /> Shipped
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <XCircle className="w-3.5 h-3.5 mr-1" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <Package className="h-8 w-8 text-orange-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 rounded-lg flex items-center mb-8">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">No orders yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">When you place orders, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Order Header */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center space-x-6">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Order Placed</p>
                      <p className="text-sm text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Total</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">₹{order.totalPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Order ID</p>
                      <p className="text-sm text-gray-900 dark:text-white">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Details */}
                <div className="px-6 py-6 flex flex-col md:flex-row items-center gap-6">
                  <img 
                    src={order.productId?.images?.[0] || 'https://via.placeholder.com/150'} 
                    alt={order.productId?.name} 
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {order.productId?.name || 'Product unavailable'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                       Sold by: {order.productId?.shopName || 'Unknown Artisan'}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                       Qty: {order.quantity} × ₹{((order.totalPrice || 0) / (order.quantity || 1)).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="w-full md:w-auto mt-4 md:mt-0">
                    {(order.status === 'pending') && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingId === order._id}
                        className="w-full md:w-auto px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        {cancellingId === order._id ? (
                          <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                            Cancelling...
                          </span>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-1.5" />
                            Cancel Order
                          </>
                        )}
                      </button>
                    )}
                    {(order.status === 'shipped') && (
                      <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                        <Truck className="w-4 h-4 mr-1.5" />
                        On the way
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
