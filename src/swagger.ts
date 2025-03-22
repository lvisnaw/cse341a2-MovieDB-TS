import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Movies API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        OAuth2: {
          type: 'oauth2',
          description: 'OAuth 2.0 Authorization using Google.',
          flows: {
            authorizationCode: {
              authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
              tokenUrl: 'https://oauth2.googleapis.com/token',
              scopes: {
                profile: 'Access user\'s profile information',
                email: 'Access user\'s email address',
              },
            },
          },
        },
        BearerAuth: {  // ✅ Added JWT Bearer Token Authentication
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer your_token_here'
        }
      },
      schemas: {
        Wishlist: {
          type: 'object',
          properties: {
            name: { type: 'string', example: '80s Movies' },
            movies: {
            type: "array",
            items: {
              "$ref": "#/components/schemas/WishlistMovie"
            },
            description: "A list of movies in the wishlist"
          }
          }
        },
        WishlistMovie: {
        type: "object",
        properties: {
          title: {
            type: "string",
            example: 'Back to the Future'
          },
          genre: {
            type: "string",
            example: ['Family', 'Sci-Fi'] 
          },
          releaseYear: {
            type: "integer",
            example: 1985
          }
        },
        required: ["title", "releaseYear"]
      },        
        Movie: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Movie Title' },
            genre: { 
              type: 'array', 
              items: { type: 'string' }, 
              example: ['Action', 'Sci-Fi'] 
            },
            releaseYear: { type: 'integer', example: 2025 },
            format: { 
              type: 'string', 
              description: 'MongoDB ObjectId of the format type', 
              example: '67d9fac9a96d0156f1cf5994' 
            },
            director: { type: 'string', example: 'Director Name' },
            leadActors: {
              type: 'array',
              items: { type: 'string' },
              example: ['Actor One', 'Actor Two'],
            },
            description: { type: 'string', example: 'A thrilling action-packed movie with a twist.' }
          },
        },
        MediaType: {
          type: 'object',
          properties: {
            mediaType: { type: 'string', example: 'Blu-ray' },
            description: { type: 'string', example: 'High-definition optical disc format' }
          },
          required: ['mediaType']
        },
        User: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', example: 'johndoe@example.com' },
            password: { type: 'string', example: 'strongpassword123' },
            accountType: {
              type: 'string',
              enum: ['read-only', 'read-write', 'admin'],
              example: 'admin'
            }
          },
          required: ['username', 'email', 'password']
        },
        UserUpdate: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'updatedUsername' },
            password: { type: 'string', example: 'newPassword123' },
            accountType: { type: 'string', example: 'read-write' }
          },
        },
        LoginRequest: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'testReadUser' },
            password: { type: 'string', example: 'readpassword123' }
          },
          required: ['email', 'password']
        }       
      },
    },
    security: [{ BearerAuth: [] }],  // ✅ Apply Bearer Token Authentication globally
  },
  apis: ['./src/routes/movies.ts','./src/routes/wishlists.ts', './src/routes/mediaType.ts', './src/routes/users.ts', './src/routes/auth.ts'], // ✅ Ensure all route files are included
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📜 Swagger Docs available at /api-docs');
};
