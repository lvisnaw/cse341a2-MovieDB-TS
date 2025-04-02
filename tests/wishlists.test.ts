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
        accountType: 'admin'
      },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
};


describe('Wishlist API', () => {
    let server;
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

    // GET all wishlists..
    test('GET /api/wishlists should return a list of wishlists', async () => {
        const response = await request(app).get('/api/wishlists');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // POST - Create a new wishlist..
    test('POST /api/wishlists should create a new wishlist', async () => {

        const token = generateAuthToken();

        console.log(`This is the TOKEN ${token}`)
        
        const newWishlist = {
            name: "80s Movies"
        };
        
        const response = await request(app)
            .post('/api/wishlists')
            .send(newWishlist)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);
    
        console.log('Response status:', response.status);
        console.log('Response body:', response.body);
        console.log('Response headers:', response.headers);
    
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('name', "80s Movies");

        // Store the movie ID for deletion in the after hook
        wishlistId = response.body._id;
        console.log(`THIS IS THE WISHLIST ID${wishlistId}`);
    });

    // GET wishlist by id..
    test('GET /api/wishlists/:id should return a specific wishlist', async () => {
        const token = generateAuthToken();
            
        const response = await request(app)
        .get(`/api/wishlists/${wishlistId}`)  
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);
    
        console.log('Get by ID - Response status:', response.status);
        console.log('Get by ID - Response body:', response.body);
            
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id', wishlistId);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('movies');
        expect(Array.isArray(response.body.movies)).toBe(true);
    
        // Check if each item in the movies array has the expected properties
        response.body.movies.forEach(movie => {
            expect(movie).toHaveProperty('title');
            expect(movie).toHaveProperty('genre');
            expect(movie).toHaveProperty('releaseYear');
    
            expect(typeof movie.title).toBe('string');
            expect(Array.isArray(movie.genre)).toBe(true);//genre array
            expect(typeof movie.releaseYear).toBe('number');
        });
    });
    
    // PUT - Update a wishlist
    test('PUT /api/wishlists/:id should update an existing wishlist', async () => {
        const token = generateAuthToken(); // Generate auth token

        const updatedWishlistData = {
            name: "Updated 80s Movies",
        };

        const response = await request(app)
            .put(`/api/wishlists/${wishlistId}`)
            .send(updatedWishlistData)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        console.log('Update Wishlist - Response status:', response.status);
        console.log('Update Wishlist - Response body:', response.body);

        expect(response.statusCode).toBe(200); // Ensure successful update
        expect(response.body).toHaveProperty('_id', wishlistId);
        expect(response.body).toHaveProperty('name', updatedWishlistData.name);
    });

//wishlist id movie id
 

    // POST - Add a movie to a wishlist
    test('POST /api/wishlists/:id/movies should add a movie to the wishlist', async () => {
        const token = generateAuthToken();  // Generar el token JWT para autenticación
        
        // Datos de la película a agregar
        const movieData = {
            title: 'The Matrix',
            genre: ['Action', 'Sci-Fi'],
            releaseYear: 1999,
        };
        
        const response = await request(app)
            .post(`/api/wishlists/${wishlistId}/movies`) // Usa el ID de wishlist generado en pruebas anteriores
            .send(movieData)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`); // Enviar el token para autenticación

        console.log('Add Movie to Wishlist - Response status:', response.status);
        console.log('Add Movie to Wishlist - Response body:', response.body);

        expect(response.statusCode).toBe(200); // Asegurar que el estado es 200
        expect(response.body).toHaveProperty('message', 'Movie added to wishlist');
        expect(response.body.wishlist).toHaveProperty('_id', wishlistId);
        expect(response.body.wishlist.movies).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: movieData.title,
                    genre: movieData.genre,
                    releaseYear: movieData.releaseYear,
                }),
            ])
        );

        // Guardar el ID de la película para eliminarla después
        movieId = response.body.wishlist.movies.find(m => m.title === movieData.title)._id;
    });

    // DELETE - Remove a movie from a wishlist
    test('DELETE /api/wishlists/:id/movies/:movieId should remove a movie from the wishlist', async () => {
        const token = generateAuthToken(); // Generar el token JWT

        const response = await request(app)
            .delete(`/api/wishlists/${wishlistId}/movies/${movieId}`) // Usa los IDs generados antes
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        console.log('Delete Movie from Wishlist - Response status:', response.status);
        console.log('Delete Movie from Wishlist - Response body:', response.body);

        expect(response.statusCode).toBe(200); // Verificar que la respuesta es 200
        expect(response.body).toHaveProperty('message', 'Movie removed from wishlist');
        
        // Comprobar que la película ya no está en la wishlist
        const checkResponse = await request(app)
            .get(`/api/wishlists/${wishlistId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(checkResponse.statusCode).toBe(200);
        expect(checkResponse.body.movies.some(movie => movie._id === movieId)).toBe(false);
    });

    // DELETE - Remove a wishlist
    test('DELETE /api/wishlists/:id should delete an existing wishlist', async () => {
        const token = generateAuthToken(); // Generate auth token

        const response = await request(app)
            .delete(`/api/wishlists/${wishlistId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        console.log('Delete Wishlist - Response status:', response.status);
        console.log('Delete Wishlist - Response body:', response.body);

        expect(response.statusCode).toBe(200); // Ensure successful deletion
        expect(response.body).toHaveProperty('message', 'Wishlist deleted successfully');

        // Verify that the wishlist no longer exists
        const checkResponse = await request(app)
            .get(`/api/wishlists/${wishlistId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(checkResponse.statusCode).toBe(404); // Wishlist should no longer exist
    });
});
// npx jest tests/wishlists.test.ts