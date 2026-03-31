import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';
import crypto from 'crypto';
import Razorpay from 'razorpay';

const router = express.Router();

// Initialize Razorpay only if keys are available
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id') {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// @route   POST /api/orders
// @desc    Create new order
export const createOrder = async (req, res) => {
  try {
    const { productId, quantity, totalPrice } = req.body;

    // Generate mock Razorpay order if not configured
    let razorpayOrderId;
    if (razorpay) {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalPrice * 100), // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      });
      razorpayOrderId = razorpayOrder.id;
    } else {
      // Development mode: generate mock order ID
      razorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    const order = await Order.create({
      clientId: req.userId,
      productId,
      quantity,
      totalPrice,
      razorpayOrderId,
    });

    res.status(201).json({
      order,
      razorpayOrderId,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/orders/verify
// @desc    Verify payment and update order
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // If Razorpay is not configured, allow verification for development
    if (!razorpay) {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'completed', razorpayPaymentId: razorpay_payment_id || 'mock_payment' },
        { new: true }
      );
      return res.status(200).json({ success: true, message: 'Payment verified (development mode)' });
    }

    // Verify with real Razorpay signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Update order status
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'completed', razorpayPaymentId: razorpay_payment_id },
        { new: true }
      );

      res.status(200).json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/orders
// @desc    Get user orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ clientId: req.userId })
      .populate('productId')
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/orders/:id
// @desc    Get single order
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('productId')
      .populate('clientId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/orders/artisan/orders
// @desc    Get artisan's orders
export const getArtisanOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'productId',
        match: { artisanId: req.userId },
      })
      .populate('clientId')
      .sort({ createdAt: -1 });

    const filteredOrders = orders.filter(order => order.productId !== null);
    res.status(200).json({ orders: filteredOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel an order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is the client who placed the order
    if (order.clientId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Only allow cancelling if order is pending
    if (order.status !== 'pending' && order.status !== 'completed') {
      return res.status(400).json({ message: 'Order cannot be cancelled in its current state' });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/orders/:id/accept
// @desc    Accept an order (for artisans)
export const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.productId.artisanId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to accept this order' });
    }

    if (order.status !== 'pending' && order.status !== 'completed') {
      return res.status(400).json({ message: 'Order cannot be accepted in its current state' });
    }

    order.status = 'accepted';
    await order.save();

    res.status(200).json({ message: 'Order accepted successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/orders/:id/reject
// @desc    Reject an order (for artisans)
export const rejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.productId.artisanId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to reject this order' });
    }

    if (order.status !== 'pending' && order.status !== 'completed') {
      return res.status(400).json({ message: 'Order cannot be rejected in its current state' });
    }

    order.status = 'rejected';
    await order.save();

    res.status(200).json({ message: 'Order rejected successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router.post('/', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/', protect, getOrders);
router.get('/artisan/orders', protect, getArtisanOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/accept', protect, acceptOrder);
router.put('/:id/reject', protect, rejectOrder);

export default router;
