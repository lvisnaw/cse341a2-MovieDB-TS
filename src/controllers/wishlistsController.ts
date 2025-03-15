import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Wishlist, { IWishlist } from '../models/wishlist';

/**
 * Get all wishlists
 */
export const getAllWishlists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wishlists: IWishlist[] = await Wishlist.find();
    res.json(wishlists);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a wishlist by ID
 */
export const getWishlistById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid wishlist ID format' });
    }

    const wishlist: IWishlist | null = await Wishlist.findById(req.params.id);
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    res.json(wishlist);
  } catch (err) {
    next(err);
  }
};

/**
 * Add a new wishlist
 */
export const addWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newWishlist = new Wishlist(req.body);
    const savedWishlist = await newWishlist.save();
    res.status(201).json(savedWishlist);
  } catch (err) {
    next(err);
  }
};

/**
 * Update a wishlist
 */
export const updateWishlist = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid wishlist ID format' });
    }

    const updatedWishlist = await Wishlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedWishlist) return res.status(404).json({ message: 'Wishlist not found' });

    res.json(updatedWishlist);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a wishlist
 */
export const deleteWishlist = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid wishlist ID format' });
    }

    const deletedWishlist = await Wishlist.findByIdAndDelete(req.params.id);
    if (!deletedWishlist) return res.status(404).json({ message: 'Wishlist not found' });

    res.json({ message: 'Wishlist deleted successfully' });
  } catch (err) {
    next(err);
  }
};
