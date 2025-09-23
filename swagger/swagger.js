const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API with OAuth',
      version: '2.0.0',
      description: 'A secure Express Library API for managing Books and Authors with Google OAuth authentication',
    },
    servers: [
      {
        url: process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT}`,
        description: 'Live Server',
      },
    ],
    components: {
      securitySchemes: {
        googleOAuth: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: '/auth/google',
              tokenUrl: '/auth/google/callback',
              scopes: {
                'profile': 'Access your profile information',
                'email': 'Access your email address'
              }
            }
          }
        }
      }
    },
    security: [{
      googleOAuth: ['profile', 'email']
    }]
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { 
    explorer: true,
    swaggerOptions: {
      oauth: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        appName: 'Library API'
      }
    }
  }));
};