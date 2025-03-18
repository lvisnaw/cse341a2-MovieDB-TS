const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server'); // ✅ Now correctly imports the Express app

describe('Movies API', () => {
    let server;

    // ✅ Start the server before running tests
    beforeAll(() => {
        server = app.listen(4000); // ✅ Starts the server on port 4000 for testing
    });

    // ✅ Close database connection & stop server after tests
    afterAll(async () => {
        await mongoose.connection.close(); // ✅ Ensures MongoDB connection is closed
        await server.close(); // ✅ Stops the Express server to prevent Jest from hanging
    });

    test('GET /api/movies should return a list of movies', async () => {
        const response = await request(app).get('/api/movies');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
