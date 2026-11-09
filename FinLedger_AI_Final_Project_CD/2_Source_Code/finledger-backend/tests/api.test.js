const request = require('supertest');
const app = require('../app');

describe('FinLedger AI API Integration Tests', () => {

  test('GET /api/health should return health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({
      status: 'ok',
      message: 'FinLedger AI Server is running healthy'
    });
  });

  test('GET /api/blockchain/chain should return 401 when unauthorized', async () => {
    const response = await request(app)
      .get('/api/blockchain/chain')
      .expect(401);
    
    expect(response.body.success).toBe(false);
  });

  test('GET /api/transactions should return 401 when unauthorized', async () => {
    const response = await request(app)
      .get('/api/transactions')
      .expect(401);
    
    expect(response.body.success).toBe(false);
  });
});
