import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Movie, { IMovie } from '../models/movie';

/**
 * Get all movies
 */
export const getAllMovies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movies: IMovie[] = await Movie.find();
    res.json(movies);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a movie by ID
 */
export const getMovieById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
};

/**
 * Add a new movie
 */
export const addMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newMovie = new Movie(req.body);
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    next(err);
  }
};

/**
 * Update a movie
 */
export const updateMovie = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
};

/**
 * Delete a movie
 */
export const deleteMovie = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
};
