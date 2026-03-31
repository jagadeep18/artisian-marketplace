import React, { useState, useEffect } from 'react';
import { Package, Clock, XCircle, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { apiService } from '../services/apiService';

interface ArtisanOrder {
  _id: string;
  clientId: {
    _id: string;
    fullName: string;
    email: string;
    mobileNumber?: string;
  };
  productId: {
    _id: string;
    name: string;
    images: string[];
    price: number;
    shopName?: string;
  };
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled' | 'shipped';
  createdAt: string;
}

const ArtisanOrders = () => {
  const [orders, setOrders] = useState<ArtisanOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiService.getArtisanOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch your shop orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, action: 'acceptOrder' | 'rejectOrder') => {
    if (action === 'rejectOrder' && !window.confirm('Are you sure you want to reject this order? This cannot be undone.')) {
      return;
    }

    try {
      setActioningId(orderId);
      if (action === 'acceptOrder') {
        const res = await apiService.acceptOrder(orderId);
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: 'accepted' } : order
        ));
      } else if (action === 'rejectOrder') {
        const res = await apiService.rejectOrder(orderId);
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: 'rejected' } : order
        ));
      }
    } catch (err: any) {
      alert(err.message || `Failed to ${action === 'acceptOrder' ? 'accept' : 'reject'} order`);
    } finally {
      setActioningId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Clock className="w-3.5 h-3.5 mr-1" /> New Order
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accepted (Processing)
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <XCircle className="w-3.5 h-3.5 mr-1" /> Rejected
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/80 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            <XCircle className="w-3.5 h-3.5 mr-1" /> Cancelled by Buyer
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-orange-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Store Orders</h1>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-lg border border-orange-100 dark:border-orange-800/50">
            <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
              Total Orders: {orders.length}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 rounded-lg flex items-center mb-8">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">No orders yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">When customers buy your handcrafted products, they will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row">
                
                {/* Product Info Segment */}
                <div className="p-6 md:w-2/5 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex items-center space-x-4 mb-4">
                     <img 
                        src={order.productId?.images?.[0] || 'https://via.placeholder.com/150'} 
                        alt={order.productId?.name} 
                        className="w-20 h-20 object-cover rounded-lg shadow-sm bg-gray-100"
                      />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                          {order.productId?.name || 'Unknown Product'}
                        </h3>
                        <p className="text-sm font-medium text-orange-600 mt-1">₹{((order.totalPrice || 0) / (order.quantity || 1)).toLocaleString()}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {order.quantity}</p>
                      </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Order ID: #{order._id.slice(-8).toUpperCase()}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">Total: ₹{order.totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Customer Info & Actions Segment */}
                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-xs tracking-wider text-gray-500 dark:text-gray-400 uppercase font-semibold mb-2">Customer Details</h4>
                      <p className="text-base font-medium text-gray-900 dark:text-white">{order.clientId?.fullName || 'Anonymous Buyer'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{order.clientId?.email || 'No email provided'}</p>
                      {order.clientId?.mobileNumber && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Ph: {order.clientId?.mobileNumber}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {order.status === 'pending' && (
                    <div className="flex space-x-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'acceptOrder')}
                        disabled={actioningId === order._id}
                        className="flex-1 bg-green-600 text-white font-medium py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex justify-center items-center shadow-sm"
                      >
                        {actioningId === order._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        ) : (
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                        )}
                        Accept Order
                      </button>
                      
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'rejectOrder')}
                        disabled={actioningId === order._id}
                        className="flex-1 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 font-medium py-2.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50 flex justify-center items-center"
                      >
                        <XCircle className="w-5 h-5 mr-2" /> Reject
                      </button>
                    </div>
                  )}

                  {order.status === 'cancelled' && (
                     <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                       <p className="text-sm text-gray-500 italic">This order was cancelled by the customer before processing.</p>
                     </div>
                  )}
                  {order.status === 'accepted' && (
                     <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                       <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">You accepted this order. Please prepare for shipment.</p>
                       <button className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">Mark Shipped</button>
                     </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanOrders;
