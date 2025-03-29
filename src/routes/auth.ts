import { Router } from 'express';
import passport from 'passport';
import {
  googleAuth,
  googleCallback,
  dashboard,
  logout,
  checkAuth,
} from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

/**
 * @openapi
 * /auth/google:
 *   get:
 *     summary: Authenticate using Google OAuth
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication.
 */
router.get('/google', googleAuth);

/**
 * @openapi
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects after successful authentication.
 *       401:
 *         description: Unauthorized.
 */
// router.get('/google/callback', googleCallback);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }), // 👈 This is required
  googleCallback
);

/**
 * @openapi
 * /auth/dashboard:
 *   get:
 *     summary: Display user dashboard after authentication
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Returns the authenticated user's data.
 *       401:
 *         description: Unauthorized access.
 */
// router.get('/dashboard', authenticateJWT, dashboard);
router.get('/dashboard', dashboard); // 👈 No JWT needed

/**
 * @openapi
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User logged out successfully.
 */
router.get('/logout', logout);

/**
 * @openapi
 * /auth/check-auth:
 *   get:
 *     summary: Check authentication status
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Returns user authentication status.
 *       401:
 *         description: Not authenticated.
 */
router.get('/check-auth', authenticateJWT, checkAuth);

export default router;
