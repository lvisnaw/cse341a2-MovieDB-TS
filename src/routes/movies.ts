import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import authorizeRoles from '../middleware/roleMiddleware';
import {
  getAllMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/moviesController';

const router = Router();

/**
 * @openapi
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     description: Retrieves a list of all movies.
 *     tags:
 *       - Movies
 *     responses:
 *       200:
 *         description: Successfully retrieved movies.
 */
router.get('/', getAllMovies);

/**
 * @openapi
 * /api/movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     description: Retrieves a movie by its unique ID.
 *     tags:
 *       - Movies
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: Successfully retrieved movie.
 *       404:
 *         description: Movie not found.
 */
router.get('/:id', getMovieById);

/**
 * @openapi
 * /api/movies:
 *   post:
 *     summary: Add a new movie
 *     description: Adds a new movie to the database.
 *     tags:
 *       - Movies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Movie added successfully.
 */
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('read-write', 'admin'),
  addMovie
);

/**
 * @openapi
 * /api/movies/{id}:
 *   put:
 *     summary: Update a movie
 *     description: Updates an existing movie.
 *     tags:
 *       - Movies
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Movie updated successfully.
 */
router.put(
  '/:id',
  authenticateJWT,
  authorizeRoles('read-write', 'admin'),
  updateMovie
);

/**
 * @openapi
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     description: Deletes a movie by ID.
 *     tags:
 *       - Movies
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: Movie deleted successfully.
 */
router.delete(
  '/:id',
  authenticateJWT,
  authorizeRoles('admin'),
  deleteMovie
);

export default router;
