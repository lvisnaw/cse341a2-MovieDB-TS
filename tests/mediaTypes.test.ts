import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Server } from 'http'; // 👈 Add type for server
import { app } from '../src/server';
import { connectDB } from '../src/db/connection';

describe('Media Types API', () => {
  let server: Server; // ✅ Explicitly typed
  let token: string; // ✅ Explicitly typed
  let createdMediaId: string; // ✅ Explicitly typed

  beforeAll(async () => {
    await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/moviedb_test');
    server = app.listen(4002);

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is required but not set.");
    }

    token = jwt.sign(
      { userId: 'test-admin-id', accountType: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
  });

  test('GET /api/media-types should return an array of media types', async () => {
    const response = await request(app).get('/api/media-types');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/media-types should create a new media type', async () => {
    const response = await request(app)
      .post('/api/media-types')
      .set('Authorization', `Bearer ${token}`)
      .send({
        mediaType: 'Test Format',
        description: 'Test Description'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('mediaType', 'Test Format');
    createdMediaId = response.body._id;
  });

  test('PUT /api/media-types/:id should update the media type', async () => {
    const response = await request(app)
      .put(`/api/media-types/${createdMediaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        mediaType: 'Updated Format',
        description: 'Updated Description'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('mediaType', 'Updated Format');
  });

  test('DELETE /api/media-types/:id should delete the media type', async () => {
    const response = await request(app)
      .delete(`/api/media-types/${createdMediaId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Media type deleted successfully');
  });
});
