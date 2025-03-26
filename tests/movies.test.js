const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/server');
const { connectDB } = require('../src/db/connection'); 

//creating a general generate token to avoid redundancy. 
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

    // Connect to DB and start server before tests
    beforeAll(async () => {
        // Connect to a test database (use a dedicated test database or in-memory MongoDB)
        await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/moviedb_test');
        server = app.listen(4000);
    });

    //Close database connection & stop server after tests
    afterAll(async () => {
        await mongoose.connection.close(); //MongoDB connection is closed
        await server.close(); //Stops the Express server
    });


    //MOVIES TESTS 
    //GET all movies
    test('GET /api/movies should return a list of movies', async () => {
        const response = await request(app).get('/api/movies');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    //WHISHLISTS TESTS 
    //GET all wishlists
    test('GET /api/wishlists should return a list of wishlists', async () => {
        const response = await request(app).get('/api/wishlists');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    

    //POST - create new movie

    test('POST /api/movies should create a new movie', async () => {
        // Generate a proper token and actually assign it
        const token = generateAuthToken();
        console.log(`This is the TOKEN ${token}`)//console log for debugging
        
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
    });

    //GET movie by id
    test('GET /api/movies/:id should return a specific movie', async () => {

        const movieId = '67a6d149ef4222d77a645499';
        // other way get an ID dynamically by querying all movies first
        // const allMoviesResponse = await request(app).get('/api/movies');
        // const movieId = allMoviesResponse.body[0]._id;

        const token = generateAuthToken();
        //request for specific movie
        const response = await request(app)
        .get(`/api/movies/${movieId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)

        console.log('Get by ID - Response status:', response.status);
        console.log('Get by ID - Response body:', response.body);
        //assert
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id', movieId);
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('genre');
        expect(response.body).toHaveProperty('releaseYear');
        expect(response.body).toHaveProperty('format');
        expect(response.body).toHaveProperty('director');
        expect(response.body).toHaveProperty('leadActors');
    });

    // UPDATE - Modify an existing movie
    test('PUT /api/movies/:id should update an existing movie', async () => {
        const movieId = '67a6d149ef4222d77a645499'; // Use a valid movie ID from your database

        const token = generateAuthToken();

        const updatedMovieData = {
            title: "Updated Movie Title",
            genre: ["Drama"],
            releaseYear: 2026,
            director: "Updated Director",
            description: "An updated description for the movie."
        };

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
        const movieId = '67a6d149ef4222d77a645499'; // Use a valid movie ID

        const token = generateAuthToken();

        const response = await request(app)
            .delete(`/api/movies/${movieId}`)
            .set('Authorization', `Bearer ${token}`);

        console.log('Delete Response status:', response.status);
        console.log('Delete Response body:', response.body);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Movie deleted successfully');
    });


});
