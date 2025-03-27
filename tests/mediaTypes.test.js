const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { app } = require('../src/server');
const { connectDB } = require('../src/db/connection');

describe('Media Types API', () => {
  let server;
  let token;
  let createdMediaId;

  beforeAll(async () => {
    await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/moviedb_test');
    server = app.listen(4002);

    // ✅ Create a test JWT token for an admin user
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

  test('GET /api/mediaTypes should return an array of media types', async () => {
    const response = await request(app).get('/api/mediaTypes');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/mediaTypes should create a new media type', async () => {
    const response = await request(app)
      .post('/api/mediaTypes')
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

  test('PUT /api/mediaTypes/:id should update the media type', async () => {
    const response = await request(app)
      .put(`/api/mediaTypes/${createdMediaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        mediaType: 'Updated Format',
        description: 'Updated Description'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('mediaType', 'Updated Format');
  });

  test('DELETE /api/mediaTypes/:id should delete the media type', async () => {
    const response = await request(app)
      .delete(`/api/mediaTypes/${createdMediaId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Media type deleted successfully');
  });
});
