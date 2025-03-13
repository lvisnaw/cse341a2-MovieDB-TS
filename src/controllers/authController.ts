// controllers/authController.ts

import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { authenticateJWT } from '../middleware/authMiddleware';

/**
 * Authenticate using Google OAuth
 */
export const googleAuth = passport.authenticate('google', { scope: ['openid', 'profile', 'email'] });

/**
 * Google OAuth callback
 */
export const googleCallback = (req: Request, res: Response): void => {
  console.log('✅ User Authenticated:', req.user);
  res.redirect('/dashboard');
};

/**
 * Display user dashboard after authentication
 */
export const dashboard = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  res.json({ message: 'Welcome!', user: req.user });
};

/**
 * Logout user
 */
export const logout = (req: Request, res: Response, next: NextFunction): void => {
  req.logout((err) => {
    if (err) {
      next(err); // Handle logout errors properly
      return;
    }
    res.redirect('/');
  });
};

/**
 * Check authentication status
 */
export const checkAuth = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }
  res.json({ message: 'User is authenticated', user: req.user });
};
