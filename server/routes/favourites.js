import express from 'express';
import Favourite from '../models/Favourite.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/favourites
// @desc    Get all favourites for current user
export const getFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({ userId: req.userId })
      .populate({
        path: 'productId',
        populate: {
          path: 'artisanId',
          select: 'shopName ownerName mobileNumber shopAddress rating totalReviews'
        }
      });

    const products = favourites
      .filter(fav => fav.productId)
      .map(fav => {
        const productObj = fav.productId.toObject();
        productObj.id = productObj._id;
        if (productObj.artisanId && productObj.artisanId._id) {
          productObj.artisan = productObj.artisanId;
        }
        return productObj;
      });

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/favourites/:productId
// @desc    Add product to favourites
export const addFavourite = async (req, res) => {
  try {
    const existing = await Favourite.findOne({
      userId: req.userId,
      productId: req.params.productId,
    });

    if (existing) {
      return res.status(400).json({ message: 'Already in favourites' });
    }

    const favourite = await Favourite.create({
      userId: req.userId,
      productId: req.params.productId,
    });

    res.status(201).json({ favourite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/favourites/:productId
// @desc    Remove product from favourites
export const removeFavourite = async (req, res) => {
  try {
    await Favourite.findOneAndDelete({
      userId: req.userId,
      productId: req.params.productId,
    });

    res.status(200).json({ message: 'Removed from favourites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/favourites/ids
// @desc    Get favourite product IDs for current user (lightweight)
export const getFavouriteIds = async (req, res) => {
  try {
    const favourites = await Favourite.find({ userId: req.userId }).select('productId');
    const ids = favourites.map(f => f.productId.toString());
    res.status(200).json({ ids });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router.get('/', protect, getFavourites);
router.get('/ids', protect, getFavouriteIds);
router.post('/:productId', protect, addFavourite);
router.delete('/:productId', protect, removeFavourite);

export default router;
