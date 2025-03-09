import { Router, Request, Response } from 'express';
import { getDb } from '../db/connection'; // Import getDb from the instructor’s pattern

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message and sample data fetch
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Successfully retrieved data
 *       500:
 *         description: Server error
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const collection = db.collection('users'); // Example collection name: 'users'
    const data = await collection.find().toArray();

    res.json({
      message: "Welcome to Leon's database!",
      data,
    });
  } catch (error: any) {
    console.error('❌ Error fetching data:', error);
    res.status(500).json({
      message: 'Error fetching data',
      error: error.message,
    });
  }
});

export default router;
