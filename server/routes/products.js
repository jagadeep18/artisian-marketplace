import express from 'express';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filters
export const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, featured } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter)
      .populate('artisanId', 'shopName ownerName mobileNumber shopAddress verified rating totalReviews')
      .sort({ featured: -1, createdAt: -1 });

    const mappedProducts = products.map(p => {
      const obj = p.toObject();
      obj.id = obj._id;
      obj.artisan = obj.artisanId;
      return obj;
    });

    res.status(200).json({ products: mappedProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/products/:id
// @desc    Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'artisanId',
      'shopName ownerName mobileNumber shopAddress verified rating totalReviews'
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const obj = product.toObject();
    obj.id = obj._id;
    obj.artisan = obj.artisanId;

    res.status(200).json({ product: obj });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/products
// @desc    Create new product (Artisan only)
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      artisanId: req.userId,
    });

    const populatedProduct = await product.populate(
      'artisanId',
      'shopName ownerName'
    );

    const obj = populatedProduct.toObject();
    obj.id = obj._id;
    obj.artisan = obj.artisanId;

    res.status(201).json({ product: obj });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/products/:id
// @desc    Update product
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.artisanId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('artisanId', 'shopName ownerName');

    const obj = product.toObject();
    obj.id = obj._id;
    obj.artisan = obj.artisanId;

    res.status(200).json({ product: obj });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/products/:id
// @desc    Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.artisanId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/products/artisan/:artisanId
// @desc    Get products by artisan
export const getArtisanProducts = async (req, res) => {
  try {
    const products = await Product.find({ artisanId: req.params.artisanId })
      .populate('artisanId', 'shopName ownerName');

    const mappedProducts = products.map(p => {
      const obj = p.toObject();
      obj.id = obj._id;
      obj.artisan = obj.artisanId;
      return obj;
    });

    res.status(200).json({ products: mappedProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/products/generate-ai
// @desc    Generate AI promotional posts based on product inputs
export const generateAIPosts = async (req, res) => {
  try {
    const {
      dressType, title, description, price, color, designType, category,
      location, contactDetails, shopName, materialsUsed, occasionType, customizationAvailable, deliveryOptions, additionalNotes, platform
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        message: "GEMINI_API_KEY is not configured. Please add it to your server/.env file."
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const platformInstructions = {
      whatsapp: "Short, Emoji friendly, Shareable format, Includes contact + price. Use WhatsApp markdown (*bold*, _italic_).",
      instagram: "Professional caption, Hashtags (10+ relevant hashtags), Stylish formatting, Product highlights. Use emojis strategically.",
      facebook: "Marketing style, Friendly tone, CTA included, Engaging storytelling format. No hashtags in the main body.",
      marketplace: "SEO optimized, Professional tone, Structured description with bullet points, Keywords included."
    };

    const selectedPlatforms = platform ? [platform] : ['whatsapp', 'instagram', 'facebook', 'marketplace'];
    const platformPrompts = selectedPlatforms.map(p =>
      `"${p}": ${platformInstructions[p]}`
    ).join('\n');

    const prompt = `You are a professional social media manager and copywriter for an artisan marketplace.
Generate promotional content for the following handcrafted product.
- Dress Type: ${dressType || 'N/A'}
- Title: ${title || 'N/A'}
- Description: ${description || 'N/A'}
- Price: ${price || 'N/A'}
- Color: ${color || 'N/A'}
- Design: ${designType || 'N/A'}
- Category: ${category || 'N/A'}
- Location: ${location || 'N/A'}
- Shop Name: ${shopName || 'N/A'}
- Materials: ${materialsUsed || 'N/A'}
- Occasion: ${occasionType || 'N/A'}
- Customization: ${customizationAvailable || 'N/A'}
- Delivery: ${deliveryOptions || 'N/A'}
- Contact: ${contactDetails || 'N/A'}
- Notes: ${additionalNotes || 'N/A'}

Generate content for ${selectedPlatforms.length === 1 ? 'the ' + selectedPlatforms[0] + ' platform' : 'all platforms'}.
Return the response STRICTLY as valid JSON with the following keys:
${platformPrompts}

Each key's value should be a single string with the full promotional content.
Do not wrap the output in markdown blocks. Return only parseable JSON matching the exact keys provided.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let aiOutput = response.text || '';
    if (aiOutput.startsWith('\`\`\`json')) {
      aiOutput = aiOutput.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
    }
    
    let parsedPosts = {};
    try {
      parsedPosts = JSON.parse(aiOutput);
    } catch (e) {
      console.error("Failed to parse AI output as JSON:", aiOutput);
      return res.status(500).json({ message: "Failed to parse AI response. Try again." });
    }

    res.status(200).json({ aiPosts: parsedPosts });
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ message: error.message || "Failed to generate content" });
  }
};

// @route   PUT /api/products/:id/ai-posts
// @desc    Save AI generated posts to a product
export const saveAIPosts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.artisanId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    product.aiPosts = req.body.aiPosts;
    product.aiGenerated = { title: true, description: true, story: true, marketing: true };
    await product.save();

    const obj = product.toObject();
    obj.id = obj._id;

    res.status(200).json({ product: obj });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router.get('/', getProducts);
router.post('/generate-ai', protect, generateAIPosts);
router.get('/artisan/:artisanId', getArtisanProducts);
router.get('/:id', getProduct);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.put('/:id/ai-posts', protect, saveAIPosts);
router.delete('/:id', protect, deleteProduct);

export default router;
