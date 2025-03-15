import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import authorizeRoles from '../middleware/roleMiddleware';
import {
  getAllWishlists,
  getWishlistById,
  addWishlist,
  updateWishlist,
  deleteWishlist,
} from '../controllers/wishlistsController';

const router = Router();

/**
 * @openapi
 * /api/wishlists:
 *   get:
 *     summary: Get all wishlists
 *     description: Retrieves a list of all wishlists.
 *     tags:
 *       - Wishlists
 *     responses:
 *       200:
 *         description: Successfully retrieved wishlists.
 */
router.get('/', getAllWishlists);

/**
 * @openapi
 * /api/wishlists/{id}:
 *   get:
 *     summary: Get a wishlist by ID
 *     description: Retrieves a wishlist by its unique ID.
 *     tags:
 *       - Wishlists
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The wishlist ID
 *     responses:
 *       200:
 *         description: Successfully retrieved wishlist.
 *       404:
 *         description: Wishlist not found.
 */
router.get('/:id', getWishlistById);

/**
 * @openapi
 * /api/wishlists:
 *   post:
 *     summary: Add a new wishlist
 *     description: Adds a new wishlist to the database.
 *     tags:
 *       - Wishlists
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wishlist'
 *     responses:
 *       201:
 *         description: Wishlist added successfully.
 */
router.post(
  '/',
  // authenticateJWT,
  // authorizeRoles('read-write', 'admin'),
  addWishlist
);

/**
 * @openapi
 * /api/wishlists/{id}:
 *   put:
 *     summary: Update a wishlist
 *     description: Updates an existing wishlist.
 *     tags:
 *       - Wishlists
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The wishlist ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wishlist'
 *     responses:
 *       200:
 *         description: Wishlist updated successfully.
 */
router.put(
  '/:id',
  // authenticateJWT,
  // authorizeRoles('read-write', 'admin'),
  updateWishlist
);

/**
 * @openapi
 * /api/wishlists/{id}:
 *   delete:
 *     summary: Delete a wishlist
 *     description: Deletes a wishlist by ID.
 *     tags:
 *       - Wishlists
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The wishlist ID
 *     responses:
 *       200:
 *         description: Wishlist deleted successfully.
 */
router.delete(
  '/:id',
  authenticateJWT,
  // authorizeRoles('admin'),
  // deleteWishlist
);

export default router;
