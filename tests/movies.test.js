const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/server');
const { connectDB } = require('../src/db/connection'); 

// Creating a general generate token to avoid redundancy. 
const jwt = require('jsonwebtoken');
const generateAuthToken = () => {
    return jwt.sign(
      { 
        userId: 'test-user-id',
        accountType: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
};


describe('Movies API', () => {
    let server;
    let movieId; // To store the movie ID for deletion after the POST test

    // Connect to DB and start server before tests
    beforeAll(async () => {
        // Connect to a test database (use a dedicated test database or in-memory MongoDB)
        await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/moviedb_test');
        server = app.listen(4000);
    });

    // Close database connection & stop server after tests
    afterAll(async () => {
        await mongoose.connection.close(); // MongoDB connection is closed
        await server.close(); // Stops the Express server
    });

    // MOVIES TESTS
    // GET all movies
    test('GET /api/movies should return a list of movies', async () => {
        const response = await request(app).get('/api/movies');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // POST - Create a new movie
    test('POST /api/movies should create a new movie', async () => {
        const token = generateAuthToken();
        console.log(`This is the TOKEN ${token}`); // Console log for debugging
        
        const newMovie = {
            title: "Movie Test Title",
            genre: [
                "Action",
                "Sci-Fi"
            ],
            releaseYear: 2025, 
            format: new mongoose.Types.ObjectId("67d9fac9a96d0156f1cf5994"), 
            director: "Director Name",
            leadActors: [
                "Actor One",
                "Actor Two"
            ],
            description: "A thrilling action-packed movie with a twist."
        };
        
        const response = await request(app)
            .post('/api/movies')
            .send(newMovie)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);
    
        console.log('Response status:', response.status);
        console.log('Response body:', response.body);
        console.log('Response headers:', response.headers);
    
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('title', "Movie Test Title");

        // Store the movie ID for deletion in the after hook
        movieId = response.body._id;
    });

    // GET movie by id
    test('GET /api/movies/:id should return a specific movie', async () => {
        const token = generateAuthToken();
        
        const response = await request(app)
        .get(`/api/movies/${movieId}`)  // Use movieId retrieved from POST test
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

        console.log('Get by ID - Response status:', response.status);
        console.log('Get by ID - Response body:', response.body);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id', movieId);
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('genre');
        expect(response.body).toHaveProperty('releaseYear');
        expect(response.body).toHaveProperty('format');
        expect(response.body).toHaveProperty('director');
        expect(response.body).toHaveProperty('leadActors');
    });

    // PUT - Modify an existing movie
    test('PUT /api/movies/:id should update an existing movie', async () => {
        const updatedMovieData = {
            title: "Updated Movie Title",
            genre: ["Drama"],
            releaseYear: 2026,
            director: "Updated Director",
            description: "An updated description for the movie."
        };

        const token = generateAuthToken();

        const response = await request(app)
            .put(`/api/movies/${movieId}`)
            .send(updatedMovieData)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        console.log('Update Response status:', response.status);
        console.log('Update Response body:', response.body);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('title', "Updated Movie Title");
        expect(response.body).toHaveProperty('genre');
        expect(response.body.genre).toContain("Drama");
        expect(response.body).toHaveProperty('releaseYear', 2026);
        expect(response.body).toHaveProperty('director', "Updated Director");
    });

    // DELETE - Remove an existing movie
    test('DELETE /api/movies/:id should delete a movie', async () => {
        const token = generateAuthToken();

        const response = await request(app)
            .delete(`/api/movies/${movieId}`) // Delete the movie created in the POST test
            .set('Authorization', `Bearer ${token}`);

        console.log('Delete Response status:', response.status);
        console.log('Delete Response body:', response.body);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Movie deleted successfully');
    });

});
//npx jest tests/movies.test.js
//npx jest --detectOpenHandles
