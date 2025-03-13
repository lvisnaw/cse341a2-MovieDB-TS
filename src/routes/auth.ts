import { Request, Response, Router } from 'express';
import passport from 'passport';
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
router.get('/google', passport.authenticate('google', { scope: ['openid', 'profile', 'email'] }));

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
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req: Request, res: Response): void => {
    console.log('✅ User Authenticated:', req.user);
    res.redirect('/dashboard');
  }
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
router.get('/dashboard', authenticateJWT, (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  res.json({ message: 'Welcome!', user: req.user });
});

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
router.get('/logout', (req: Request, res: Response, next): void => {
  req.logout((err) => {
    if (err) {
      next(err); // ✅ Handle logout errors properly
      return;
    }
    res.redirect('/');
  });
});

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
router.get('/check-auth', authenticateJWT, (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }
  res.json({ message: 'User is authenticated', user: req.user });
});

export default router;
