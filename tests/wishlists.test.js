const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/server');
const { connectDB } = require('../src/db/connection'); 

describe('Wishlist API', () => {
    let server;

    beforeAll(async () => {
        await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/moviedb_test');
        server = app.listen(4000);
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

    const jwt = require('jsonwebtoken');

    test('POST /api/wishlists should create a new wishlist', async () => {

        const token = jwt.sign(
            { 
                userId: 'test-user-id',
                accountType: 'admin'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
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
    });

});
