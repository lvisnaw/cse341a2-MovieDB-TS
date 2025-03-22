const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { app } = require('../src/server');
const { connectDB } = require('../src/db/connection');

describe('Users API', () => {
  let server;
  let createdUserId;
  let token; // User's token for update/delete
  let adminToken; // Separate token with admin privileges

  beforeAll(async () => {
    await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/moviedb_test');
    server = app.listen(4001);

    // Create admin token for delete operation
    adminToken = jwt.sign(
      {
        userId: 'test-admin-id',
        accountType: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Clean up: remove test user
    if (createdUserId) {
      await mongoose.connection.collection('users').deleteOne({ _id: new mongoose.Types.ObjectId(createdUserId) });
    }

    await mongoose.connection.close();
    await server.close();
  });

  test('POST /api/users/register should register a new user', async () => {
    const randomSuffix = Math.floor(Math.random() * 10000);
    const uniqueUsername = `jestTestUser${randomSuffix}`;

    const response = await request(app)
      .post('/api/users/register')
      .send({
        username: uniqueUsername,
        password: 'testPass123',
        accountType: 'read-write'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    createdUserId = response.body._id;
  });

  test('POST /api/users/login should return a token', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testAdminUser',
        password: 'adminpassword123'
      });

    token = response.body.token;
    expect(response.statusCode).toBe(200);
    expect(token).toBeDefined();
  });

  test('PUT /api/users/:id should update user details', async () => {
    const response = await request(app)
      .put(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'updatedJestUser' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('username', 'updatedJestUser');
  });

  test('POST /api/users/logout should log the user out', async () => {
    const response = await request(app).post('/api/users/logout');
    expect(response.statusCode).toBe(200);
  });

  test('DELETE /api/users/:id should delete the user', async () => {
    const response = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
  });
});
