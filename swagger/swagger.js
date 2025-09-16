const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'A simple Express Library API for managing Books and Authors',
    },
    servers: [
  {
    url: process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT}`,
    description: 'Live Server',
  },
],
    components: {
      securitySchemes: {
        // I'll add this in Week 4 for OAuth
      }
    }
  },
  apis: ['./routes/*.js'], // Path to the API docs files (I'll add JSDoc comments to routes)
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
};