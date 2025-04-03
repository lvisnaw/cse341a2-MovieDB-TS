import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { app } from '../src/server';
import { connectDB } from '../src/db/connection';

const generateAuthToken = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required but not set.");
  }

  return jwt.sign(
    {
      userId: 'test-user-id',
      accountType: 'admin',
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

describe('Wishlist API', () => {
  let server: import('http').Server;
  let movieId: string;
  let wishlistId: string;

  beforeAll(async () => {
    await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/moviedb_test');
    server = app.listen(4004);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
  });

  test('GET /api/wishlists should return a list of wishlists', async () => {
    const response = await request(app).get('/api/wishlists');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/wishlists should create a new wishlist', async () => {
    const token = generateAuthToken();

    const newWishlist = {
      name: '80s Movies',
    };

    const response = await request(app)
      .post('/api/wishlists')
      .send(newWishlist)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('name', '80s Movies');

    wishlistId = response.body._id;
  });

  test('GET /api/wishlists/:id should return a specific wishlist', async () => {
    const token = generateAuthToken();

    const response = await request(app)
      .get(`/api/wishlists/${wishlistId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id', wishlistId);
    expect(Array.isArray(response.body.movies)).toBe(true);

    response.body.movies.forEach((movie: any) => {
      expect(movie).toHaveProperty('title');
      expect(movie).toHaveProperty('genre');
      expect(movie).toHaveProperty('releaseYear');
      expect(typeof movie.title).toBe('string');
      expect(Array.isArray(movie.genre)).toBe(true);
      expect(typeof movie.releaseYear).toBe('number');
    });
  });

  test('PUT /api/wishlists/:id should update an existing wishlist', async () => {
    const token = generateAuthToken();

    const updatedWishlistData = {
      name: 'Updated 80s Movies',
    };

    const response = await request(app)
      .put(`/api/wishlists/${wishlistId}`)
      .send(updatedWishlistData)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id', wishlistId);
    expect(response.body).toHaveProperty('name', updatedWishlistData.name);
  });

  test('POST /api/wishlists/:id/movies should add a movie to the wishlist', async () => {
    const token = generateAuthToken();

    const movieData = {
      title: 'The Matrix',
      genre: ['Action', 'Sci-Fi'],
      releaseYear: 1999,
    };

    const response = await request(app)
      .post(`/api/wishlists/${wishlistId}/movies`)
      .send(movieData)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Movie added to wishlist');
    expect(response.body.wishlist).toHaveProperty('_id', wishlistId);

    movieId = response.body.wishlist.movies.find((m: any) => m.title === movieData.title)._id;
  });

  test('DELETE /api/wishlists/:id/movies/:movieId should remove a movie from the wishlist', async () => {
    const token = generateAuthToken();

    const response = await request(app)
      .delete(`/api/wishlists/${wishlistId}/movies/${movieId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Movie removed from wishlist');

    const checkResponse = await request(app)
      .get(`/api/wishlists/${wishlistId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(checkResponse.statusCode).toBe(200);
    expect(checkResponse.body.movies.some((movie: any) => movie._id === movieId)).toBe(false);
  });

  test('DELETE /api/wishlists/:id should delete an existing wishlist', async () => {
    const token = generateAuthToken();

    const response = await request(app)
      .delete(`/api/wishlists/${wishlistId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Wishlist deleted successfully');

    const checkResponse = await request(app)
      .get(`/api/wishlists/${wishlistId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(checkResponse.statusCode).toBe(404);
  });
});
