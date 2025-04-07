import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '9ja Market API Documentation',
      version: '1.0.0',
      description: 'API documentation for 9ja Market platform',
      contact: {
        name: 'API Support',
        email: 'support@9jamarket.com'
      }
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3100/api/v1',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key'
        }
      }
    },
    security: [{
      BearerAuth: []
    }]
  },
  apis: [
    './src/utils/swagger/schemas.ts',
    './src/auth/**/*.ts',
    './src/customer/**/*.ts',
    './src/merchant/**/*.ts',
    './src/market/**/*.ts',
    './src/product/**/*.ts',
    './src/ad/**/*.ts',
    './src/marketer/**/*.ts',
    './src/stats/**/*.ts',
  ]
};

export const specs = swaggerJsdoc(options);
