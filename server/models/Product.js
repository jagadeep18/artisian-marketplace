import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    dressType: String,
    color: String,
    design: String,
    category: String,
    location: String,
    contact: String,
    shopName: String,
    materials: [String],
    occasion: String,
    customization: String,
    delivery: String,
    images: [String],
    artisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    aiPosts: {
      whatsapp: String,
      instagram: String,
      facebook: String,
      marketplace: String,
    },
    aiGenerated: {
      title: Boolean,
      description: Boolean,
      story: Boolean,
      marketing: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
