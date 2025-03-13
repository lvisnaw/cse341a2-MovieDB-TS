import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import { authenticateJWT } from '../middleware/authMiddleware';
import authorizeRoles from '../middleware/roleMiddleware';

const router = Router();

// ✅ Ensure JWT_SECRET is always set
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('❌ ERROR: JWT_SECRET is missing! Exiting...');
}

console.log('🔍 JWT_SECRET being used for signing:', JWT_SECRET); // ✅ Debugging log

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 */
router.post(
  '/register',
  (async (req, res, next) => {
    try {
      const { username, password, accountType } = req.body;

      if (!username || !password || !accountType) {
        res.status(400).json({ message: 'Username, password, and account type are required' });
        return;
      }

      const existingUser: IUser | null = await User.findOne({ username });
      if (existingUser) {
        res.status(400).json({ message: 'Username already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword, accountType });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      next(error);
    }
  }) as RequestHandler
);

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Users
 */
router.post(
  '/login',
  (async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user: IUser | null = await User.findOne({ username });
      if (!user || !user.password) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
      }

      const token = jwt.sign(
        { userId: user._id, accountType: user.accountType },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      console.log('✅ Generated JWT Token:', token);
      res.status(200).json({ message: 'Login successful', token, accountType: user.accountType });
    } catch (error) {
      next(error);
    }
  }) as RequestHandler
);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Update a user's details
 *     tags:
 *       - Users
 */
router.put(
  '/:id',
  authenticateJWT,
  authorizeRoles('admin'),
  (async (req, res, next) => {
    try {
      const { password, accountType } = req.body;
      const user: IUser | null = await User.findById(req.params.id);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      if (accountType) {
        user.accountType = accountType;
      }

      await user.save();
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      next(error);
    }
  }) as RequestHandler
);

/**
 * @openapi
 * /api/users/logout:
 *   post:
 *     summary: Log out a user
 *     tags:
 *       - Users
 */
router.post('/logout', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logged out successfully. Clear the JWT token from local storage or cookies on the client side.' });
});

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 */
router.delete(
  '/:id',
  authenticateJWT,
  authorizeRoles('admin'),
  (async (req, res, next) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }) as RequestHandler
);

export default router;
