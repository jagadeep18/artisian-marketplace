import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register user
export const register = async (req, res) => {
  try {
    const { email, password, role, ...userData } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    user = await User.create({
      email,
      password,
      role,
      ...userData,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        shopName: user.shopName,
        ownerName: user.ownerName,
        shopAddress: user.shopAddress,
        pinCode: user.pinCode,
        revenue: user.revenue,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/auth/login
// @desc    Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        shopName: user.shopName,
        ownerName: user.ownerName,
        shopAddress: user.shopAddress,
        pinCode: user.pinCode,
        revenue: user.revenue,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/auth/me
// @desc    Get current logged in user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        shopName: user.shopName,
        ownerName: user.ownerName,
        shopAddress: user.shopAddress,
        pinCode: user.pinCode,
        revenue: user.revenue,
        verified: user.verified,
        rating: user.rating,
        totalReviews: user.totalReviews,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { currentPassword, password, ...otherUpdates } = req.body;

    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password' });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = password;
    }

    Object.keys(otherUpdates).forEach(key => {
      user[key] = otherUpdates[key];
    });

    await user.save();

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        shopName: user.shopName,
        ownerName: user.ownerName,
        shopAddress: user.shopAddress,
        pinCode: user.pinCode,
        revenue: user.revenue,
        verified: user.verified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

export default router;
