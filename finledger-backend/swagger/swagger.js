const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FinLedger AI API',
      version: '1.0.0',
      description: 'API documentation for FinLedger AI Backend, a Blockchain-Enabled Organizational Finance Monitor.',
      contact: {
        name: 'Developer',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'staff'] },
            organization: { type: 'string' }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            amount: { type: 'number' },
            type: { type: 'string', enum: ['income', 'expense'] },
            category: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            blockIndex: { type: 'number' },
            blockHash: { type: 'string' }
          }
        },
        Budget: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            limitAmount: { type: 'number' },
            spentAmount: { type: 'number' },
            month: { type: 'string' },
            status: { type: 'string', enum: ['within_limit', 'warning', 'exceeded'] }
          }
        },
        Block: {
          type: 'object',
          properties: {
            index: { type: 'number' },
            timestamp: { type: 'string' },
            data: { type: 'object' },
            previousHash: { type: 'string' },
            hash: { type: 'string' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
