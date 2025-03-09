import { Router, Request, Response } from 'express';
import passport from 'passport';

const router = Router();

/**
 * @openapi
 * /auth/google:
 *   get:
 *     summary: Authenticate using Google OAuth
 *     description: |
 *       Redirects to Google for authentication.  
 *       **Note:** This endpoint **cannot be tested in Swagger UI**.  
 *       To test, **open this URL in a browser instead**:  
 *       - **Local:** [http://localhost:3000/auth/google](http://localhost:3000/auth/google)  
 *       - **Production:** [https://cse341a2-movie-lesson7.onrender.com/auth/google](https://cse341a2-movie-lesson7.onrender.com/auth/google)
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
 *     description: |
 *       This endpoint handles the response from Google after authentication.  
 *       **Note:** This endpoint **cannot be tested in Swagger UI**.  
 *       To test, follow these steps in a browser:  
 *       1. **Log in via Google OAuth:** [http://localhost:3000/auth/google](http://localhost:3000/auth/google)  
 *          - Production: [https://cse341a2-movie-lesson7.onrender.com/auth/google](https://cse341a2-movie-lesson7.onrender.com/auth/google)  
 *       2. **Check authentication status:** [http://localhost:3000/auth/check-auth](http://localhost:3000/auth/check-auth)  
 *          - Production: [https://cse341a2-movie-lesson7.onrender.com/auth/check-auth](https://cse341a2-movie-lesson7.onrender.com/auth/check-auth)
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects after successful authentication.
 *       401:
 *         description: Unauthorized.
 */
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req: Request, res: Response) => {
    console.log('✅ User Authenticated:', req.user); // Debugging output
    res.redirect('/dashboard'); // ✅ Redirect to dashboard
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
router.get('/dashboard', (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
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
router.get('/logout', (req: Request, res: Response) => {
  req.logout(() => {
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
router.get('/check-auth', (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json({ message: 'User is authenticated', user: req.user });
});

export default router;
