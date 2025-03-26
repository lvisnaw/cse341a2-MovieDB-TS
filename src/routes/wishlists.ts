import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import authorizeRoles from '../middleware/roleMiddleware';
import {
  getAllWishlists,
  getWishlistById,
  addWishlist,
  updateWishlist,
  deleteWishlist,
  addMovieToWishlist,
  deleteMovieFromWishlist,
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
  authenticateJWT,
  authorizeRoles('admin'),
  addWishlist
);

/**
 * @openapi
 * /api/wishlists/{id}/movies:
 *   post:
 *     summary: Add a new Movie to a wishlist
 *     description: Add a new Movie to a wishlist to the database.
 *     tags:
 *       - Wishlists
*     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The wishlist ID* 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WishlistMovie'
 *     responses:
 *       201:
 *         description: Wishlist Movie added successfully.
 */
router.post(
  '/:id/movies',
  authenticateJWT,
  authorizeRoles('admin'),
  addMovieToWishlist
);

/**
 * @openapi
 * /api/wishlists/{id}/movies/{movieId}:
 *   delete:
 *     summary: Remove a Movie from a wishlist
 *     description: Remove a Movie from a wishlist in the database.
 *     tags:
 *       - Wishlists
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The wishlist ID* 
 *       - name: movieId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The Movie Id* 
 *     responses:
 *       201:
 *         description: Wishlist updated successfully.
 */
router.delete(
  '/:id/movies/:movieId',
  authenticateJWT,
  authorizeRoles('admin'),
  deleteMovieFromWishlist
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
  authenticateJWT,
  authorizeRoles('admin'),
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
  authorizeRoles('admin'),
  deleteWishlist
);




export default router;
