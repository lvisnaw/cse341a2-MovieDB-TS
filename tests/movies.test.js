const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/server'); // Using destructuring now
const { connectDB } = require('../src/db/connection'); 

describe('Movies API', () => {
    let server;

    // Connect to DB and start server before tests
    beforeAll(async () => {
        // Connect to a test database (use a dedicated test database or in-memory MongoDB)
        await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/moviedb_test');
        server = app.listen(4000);
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

    test('GET /api/wishlists should return a list of wishlists', async () => {
        const response = await request(app).get('/api/wishlists');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    //using token to validate
    // const token = process.env.JWT_SECRET;
    // test('POST /api/movies should create a new movie', async () => {
    //     const newMovie = {
    //         title: "Movie Test Title",
    //         genre: [
    //             "Action",
    //             "Sci-Fi"
    //         ],
    //         releaseYear: 2025, 
    //         format: new mongoose.Types.ObjectId("67d9fac9a96d0156f1cf5994"), 
    //         director: "Director Name",
    //         leadActors: [
    //             "Actor One",
    //             "Actor Two"
    //         ],
    //         description: "A thrilling action-packed movie with a twist."
    //     };
        
    //     const response = await request(app)
    //         .post('/api/movies')
    //         .send(newMovie) // sending the data to create a movie
    //         .set('Accept', 'application/json') 
    //         .set('Authorization', `Bearer ${token}`);//added token 

    //     expect(response.statusCode).toBe(201); // Expecting 201 for successful creation
    //     expect(response.body).toHaveProperty('title', 'Inception'); // Check that the movie is created with the correct title
    // });
    
});
