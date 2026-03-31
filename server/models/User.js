import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['client', 'artisan'],
      required: true,
    },
    fullName: String,
    mobileNumber: String,
    shopName: String,
    ownerName: String,
    shopAddress: String,
    pinCode: String,
    revenue: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    // AI Trust Score System
    trustScore: {
      score: { type: Number, default: 0, min: 0, max: 100 },
      level: { type: String, enum: ['HIGH_RISK', 'RISKY', 'MODERATE', 'TRUSTED', 'HIGHLY_TRUSTED'], default: 'MODERATE' },
      fraudRisk: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
      paymentRecommendation: { type: String, enum: ['DIRECT', 'ESCROW', 'COD'], default: 'ESCROW' },
      verification: {
        phone: { type: Boolean, default: false },
        email: { type: Boolean, default: false },
        location: { type: Boolean, default: false },
        shop: { type: Boolean, default: false },
        socialPresence: { type: String, enum: ['NONE', 'LOW', 'MEDIUM', 'HIGH'], default: 'NONE' },
      },
      profileCompleteness: { type: Number, default: 0, min: 0, max: 100 },
      pricingRealism: { type: Number, default: 50, min: 0, max: 100 },
      productConsistency: { type: Number, default: 50, min: 0, max: 100 },
      aiAnalysis: { type: String, default: '' },
      lastAnalyzed: { type: Date },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
