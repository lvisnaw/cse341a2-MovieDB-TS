import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import mongoose from 'mongoose';
import Movie, { IMovie } from '../models/movie';
import { authenticateJWT } from '../middleware/authMiddleware';
import authorizeRoles from '../middleware/roleMiddleware';

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
router.get('/', (async (req, res, next) => {
  try {
    const movies: IMovie[] = await Movie.find();
    res.json(movies);
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

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
router.get('/:id', (async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid movie ID format' });
    }

    const movie: IMovie | null = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    res.json(movie);
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

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
  (async (req, res, next) => {
    try {
      const newMovie = new Movie(req.body);
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch (err) {
      next(err);
    }
  }) as RequestHandler
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
  (async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid movie ID format' });
      }

      const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedMovie) return res.status(404).json({ message: 'Movie not found' });

      res.json(updatedMovie);
    } catch (err) {
      next(err);
    }
  }) as RequestHandler
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
  (async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid movie ID format' });
      }

      const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
      if (!deletedMovie) return res.status(404).json({ message: 'Movie not found' });

      res.json({ message: 'Movie deleted successfully' });
    } catch (err) {
      next(err);
    }
  }) as RequestHandler
);

export default router;
