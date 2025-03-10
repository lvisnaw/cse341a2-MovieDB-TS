const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
              enum: ['Blu-ray', 'DVD', 'Streaming', 'Digital Download'], 
              example: 'Streaming' 
            },
            director: { type: 'string', example: 'Director Name' },
            leadActors: {
              type: 'array',
              items: { type: 'string' },
              example: ['Actor One', 'Actor Two'],
            },
            personalRating: { type: 'integer', example: 5 },
            description: { type: 'string', example: 'A thrilling action-packed movie with a twist.' }
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],  // ✅ Apply Bearer Token Authentication globally
  },
  apis: ['./routes/movies.js', './routes/users.js', './routes/auth.js'], // ✅ Ensure all route files are included
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📜 Swagger Docs available at /api-docs');
};

module.exports = { setupSwagger };


// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'My Movies API',
//       version: '1.0.0',
//     },
//     components: {
//       securitySchemes: {
//         OAuth2: {
//           type: 'oauth2',
//           description: 'OAuth 2.0 Authorization using Google.',
//           flows: {
//             authorizationCode: {
//               authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
//               tokenUrl: 'https://oauth2.googleapis.com/token',
//               scopes: {
//                 profile: 'Access user\'s profile information',
//                 email: 'Access user\'s email address',
//               },
//             },
//           },
//         },
//       },
//       schemas: {
//         Movie: {
//           type: 'object',
//           properties: {
//             title: { type: 'string', example: 'Movie Title' },
//             genre: { type: 'string', example: 'Genre' },
//             releaseYear: { type: 'integer', example: 2025 },
//             format: { 
//               type: 'string', 
//               enum: ['Blu-ray', 'DVD', 'Streaming', 'Digital Download'], 
//               example: 'Streaming' 
//             },
//             director: { type: 'string', example: 'Director Name' },
//             leadActors: {
//               type: 'array',
//               items: { type: 'string' },
//               example: ['Actor One', 'Actor Two'],
//             },
//             personalRating: { type: 'integer', example: 5 },
//           },
//         },
//       },
//     },
//   },
//   apis: ['./routes/movies.js', './routes/users.js', './routes/auth.js'],
// };

// const swaggerSpec = swaggerJsdoc(options);

// const setupSwagger = (app) => {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//   console.log('📜 Swagger Docs available at /api-docs');
// };

// module.exports = { setupSwagger };
