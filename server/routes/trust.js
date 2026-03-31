import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

// ── Helpers ──────────────────────────────────────────────

function calculateProfileCompleteness(user) {
  const fields = ['email', 'mobileNumber', 'shopName', 'ownerName', 'shopAddress', 'pinCode', 'revenue'];
  const filled = fields.filter(f => user[f] && user[f].toString().trim() !== '').length;
  return Math.round((filled / fields.length) * 100);
}

function validatePhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/[^0-9]/g, '');
  // Indian mobile: 10 digits starting with 6-9, or with 91 prefix
  return /^(?:91)?[6-9]\d{9}$/.test(cleaned);
}

function validateEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePinCode(pinCode) {
  if (!pinCode) return false;
  return /^[1-9][0-9]{5}$/.test(pinCode.trim());
}

function analyzePricingRealism(products) {
  if (!products || products.length === 0) return 50;
  const prices = products.map(p => p.price).filter(p => p > 0);
  if (prices.length === 0) return 50;
  
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const suspiciouslyLow = prices.filter(p => p < 50).length;
  const suspiciouslyHigh = prices.filter(p => p > 100000).length;
  const suspiciousRatio = (suspiciouslyLow + suspiciouslyHigh) / prices.length;
  
  if (suspiciousRatio > 0.5) return 20;
  if (suspiciousRatio > 0.25) return 40;
  if (avg < 100) return 30;
  if (avg > 50000) return 40;
  return 80;
}

function analyzeProductConsistency(products) {
  if (!products || products.length === 0) return 50;
  
  // Check for duplicate names
  const names = products.map(p => p.name?.toLowerCase().trim());
  const uniqueNames = new Set(names);
  const duplicateRatio = 1 - (uniqueNames.size / names.length);

  // Check for descriptions
  const hasDescription = products.filter(p => p.description && p.description.length > 10).length;
  const descriptionRatio = hasDescription / products.length;

  let score = 50;
  if (duplicateRatio > 0.3) score -= 30;
  score += descriptionRatio * 30;
  if (products.length >= 3) score += 10;
  if (products.length >= 5) score += 10;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

function deriveTrustLevel(score) {
  if (score >= 90) return 'HIGHLY_TRUSTED';
  if (score >= 70) return 'TRUSTED';
  if (score >= 50) return 'MODERATE';
  if (score >= 30) return 'RISKY';
  return 'HIGH_RISK';
}

function derivePaymentRecommendation(score, fraudRisk) {
  if (score >= 80 && fraudRisk === 'LOW') return 'DIRECT';
  if (score >= 50) return 'ESCROW';
  return 'COD';
}

// ── QNN-Inspired Trust Score Calculation ─────────────────
// Simulates quantum superposition & interference patterns
// using weighted feature vectors with wave-function collapse

function qnnInspiredTrustScore(features) {
  // Feature vector: each factor has a weight inspired by quantum amplitudes
  const amplitudes = {
    profileCompleteness: 0.20,
    phoneVerified: 0.12,
    emailVerified: 0.10,
    locationVerified: 0.10,
    pricingRealism: 0.15,
    productConsistency: 0.13,
    productVolume: 0.10,
    accountAge: 0.10,
  };

  // Quantum amplitude encoding (normalize each feature to 0-1)
  const encoded = {
    profileCompleteness: features.profileCompleteness / 100,
    phoneVerified: features.phoneVerified ? 1 : 0,
    emailVerified: features.emailVerified ? 1 : 0,
    locationVerified: features.locationVerified ? 1 : 0,
    pricingRealism: features.pricingRealism / 100,
    productConsistency: features.productConsistency / 100,
    productVolume: Math.min(features.productCount / 10, 1),
    accountAge: Math.min(features.accountAgeDays / 90, 1),
  };

  // Quantum interference: constructive if features align, destructive if contradicting
  let constructive = 0;
  let totalWeight = 0;
  for (const [key, amp] of Object.entries(amplitudes)) {
    const val = encoded[key] || 0;
    // Simulated quantum probability = |amplitude|²
    constructive += (val * val) * amp;
    totalWeight += amp;
  }

  // Wave function collapse → classical trust score
  let rawScore = (constructive / totalWeight) * 100;

  // Fraud penalty (destructive interference from negative signals)
  if (!features.phoneVerified && !features.emailVerified) rawScore *= 0.6;
  if (features.pricingRealism < 30) rawScore *= 0.7;
  if (features.productCount === 0) rawScore *= 0.8;

  return Math.round(Math.max(0, Math.min(100, rawScore)));
}

// ── Gemini AI Deep Analysis ────────────────────────────

async function runGeminiAnalysis(user, products) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const productSummary = products.slice(0, 5).map(p => 
      `"${p.name}" priced at ₹${p.price} in category "${p.category || 'N/A'}"`
    ).join(', ');

    const prompt = `You are a marketplace fraud detection AI. Analyze this artisan seller's profile and products.

Seller Profile:
- Shop Name: ${user.shopName || 'Not provided'}
- Owner: ${user.ownerName || 'Not provided'}
- Location: ${user.shopAddress || 'Not provided'}
- PIN Code: ${user.pinCode || 'Not provided'}
- Phone: ${user.mobileNumber || 'Not provided'}
- Email: ${user.email}
- Monthly Revenue: ₹${user.revenue || 0}
- Products listed: ${products.length}
- Product samples: ${productSummary || 'None'}

Analyze for:
1. Does the shop name sound like a real business?
2. Is the pricing realistic for handmade artisan goods?
3. Are there red flags for fraud (fake listings, unrealistic pricing, suspicious patterns)?
4. Social presence assessment
5. Overall trustworthiness assessment

Return STRICTLY as valid JSON:
{
  "shopAuthenticity": "HIGH" | "MEDIUM" | "LOW",
  "pricingAssessment": "REALISTIC" | "SUSPICIOUS" | "PREDATORY",
  "fraudIndicators": ["list of any red flags found"],
  "socialPresence": "HIGH" | "MEDIUM" | "LOW" | "NONE",
  "overallRisk": "LOW" | "MEDIUM" | "HIGH",
  "summary": "one paragraph analysis"
}

Do not wrap in markdown. Return only parseable JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let output = response.text || '';
    if (output.startsWith('```json')) output = output.replace(/```json/g, '').replace(/```/g, '');
    return JSON.parse(output.trim());
  } catch (e) {
    console.error('Gemini trust analysis error:', e.message);
    return null;
  }
}

// ── API Routes ────────────────────────────────────────────

// @route POST /api/trust/analyze/:artisanId
// @desc  Run full trust score analysis for an artisan
router.post('/analyze/:artisanId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.artisanId);
    if (!user || user.role !== 'artisan') {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    const products = await Product.find({ artisanId: user._id });

    // Step 1: Basic verifications
    const phoneVerified = validatePhone(user.mobileNumber);
    const emailVerified = validateEmail(user.email);
    const locationVerified = validatePinCode(user.pinCode) && !!user.shopAddress;
    const profileCompleteness = calculateProfileCompleteness(user);
    const pricingRealism = analyzePricingRealism(products);
    const productConsistency = analyzeProductConsistency(products);

    // Step 2: Account age
    const accountAgeDays = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));

    // Step 3: QNN-Inspired score calculation
    const trustScore = qnnInspiredTrustScore({
      profileCompleteness,
      phoneVerified,
      emailVerified,
      locationVerified,
      pricingRealism,
      productConsistency,
      productCount: products.length,
      accountAgeDays,
    });

    // Step 4: Gemini AI deep analysis
    const geminiAnalysis = await runGeminiAnalysis(user, products);
    let adjustedScore = trustScore;
    let socialPresence = 'NONE';
    let aiSummary = '';

    if (geminiAnalysis) {
      // Adjust score based on AI findings
      if (geminiAnalysis.overallRisk === 'HIGH') adjustedScore = Math.min(adjustedScore, 35);
      else if (geminiAnalysis.overallRisk === 'LOW') adjustedScore = Math.max(adjustedScore, adjustedScore + 10);

      if (geminiAnalysis.pricingAssessment === 'PREDATORY') adjustedScore -= 15;
      if (geminiAnalysis.shopAuthenticity === 'HIGH') adjustedScore += 5;

      adjustedScore = Math.max(0, Math.min(100, adjustedScore));
      socialPresence = geminiAnalysis.socialPresence || 'NONE';
      aiSummary = geminiAnalysis.summary || '';
    }

    // Step 5: Derive levels
    const level = deriveTrustLevel(adjustedScore);
    const fraudRisk = adjustedScore >= 70 ? 'LOW' : adjustedScore >= 40 ? 'MEDIUM' : 'HIGH';
    const paymentRecommendation = derivePaymentRecommendation(adjustedScore, fraudRisk);

    // Step 6: Save to DB
    user.trustScore = {
      score: adjustedScore,
      level,
      fraudRisk,
      paymentRecommendation,
      verification: {
        phone: phoneVerified,
        email: emailVerified,
        location: locationVerified,
        shop: !!user.shopName && user.shopName.length > 2,
        socialPresence,
      },
      profileCompleteness,
      pricingRealism,
      productConsistency,
      aiAnalysis: aiSummary,
      lastAnalyzed: new Date(),
    };
    user.verified = adjustedScore >= 70;
    await user.save();

    res.status(200).json({
      trustScore: user.trustScore,
      verified: user.verified,
    });
  } catch (error) {
    console.error('Trust analysis error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/trust/:artisanId
// @desc  Get trust score for an artisan (public-facing)
router.get('/:artisanId', async (req, res) => {
  try {
    const user = await User.findById(req.params.artisanId).select(
      'shopName ownerName verified trustScore'
    );
    if (!user) {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    res.status(200).json({
      artisanId: user._id,
      shopName: user.shopName,
      ownerName: user.ownerName,
      verified: user.verified,
      trustScore: user.trustScore || { score: 0, level: 'MODERATE' },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/trust/payment-recommendation/:artisanId
// @desc  Get AI payment recommendation before purchase
router.get('/payment-recommendation/:artisanId', async (req, res) => {
  try {
    const user = await User.findById(req.params.artisanId).select('trustScore verified shopName');
    if (!user) {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    const ts = user.trustScore || {};
    const recommendation = {
      paymentMode: ts.paymentRecommendation || 'ESCROW',
      trustLevel: ts.level || 'MODERATE',
      score: ts.score || 0,
      verified: user.verified || false,
      shopName: user.shopName,
      message: '',
      safetyBadge: '',
    };

    if (recommendation.paymentMode === 'DIRECT') {
      recommendation.message = 'This seller is highly trusted. Direct payment is safe.';
      recommendation.safetyBadge = '🟢 Safe to Pay Directly';
    } else if (recommendation.paymentMode === 'ESCROW') {
      recommendation.message = 'We recommend using platform escrow for added protection.';
      recommendation.safetyBadge = '🟡 Escrow Recommended';
    } else {
      recommendation.message = 'For your safety, we recommend Cash on Delivery for this seller.';
      recommendation.safetyBadge = '🔴 COD Recommended';
    }

    res.status(200).json(recommendation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
