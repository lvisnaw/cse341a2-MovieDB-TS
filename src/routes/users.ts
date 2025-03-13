import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user'; // Import IUser interface
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "testUser"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               accountType:
 *                 type: string
 *                 example: "read"
 *     responses:
 *       201:
 *         description: User registered successfully.
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password, accountType } = req.body;

    if (!username || !password || !accountType) {
      return res.status(400).json({ message: 'Username, password, and account type are required' });
    }

    const existingUser: IUser | null = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, accountType });

    await newUser.save();
    
    // ✅ Explicitly return the response
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "testReadUser"
 *               password:
 *                 type: string
 *                 example: "readpassword123"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token.
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user: IUser | null = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    if (!user.password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    const token = jwt.sign(
      { userId: user._id, accountType: user.accountType },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('✅ Generated users.ts JWT Token:', token); // ✅ Debugging Log

    res.status(200).json({
      message: 'Login successful',
      token,
      accountType: user.accountType
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Update a user's details
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *               accountType:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: User updated successfully.
 */
router.put('/:id', authenticateJWT, authorizeRoles('admin'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { password, accountType } = req.body;

    const user: IUser | null = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

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
});

/**
 * @openapi
 * /api/users/logout:
 *   post:
 *     summary: Log out a user
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User logged out successfully.
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
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: User deleted successfully.
 */
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
