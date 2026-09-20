const request = require('supertest');
const app = require('../app');

describe('Expenses API', () => {
    test('GET /expenses returns an array', async () => {
    const response = await request(app).get('/expenses');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /expenses with valid data returns 201', async () => {
    const response = await request(app)
      .post('/expenses')
      .send({ amount: 250, category: 'Test category from Jest', date: '2026-09-20' });
    expect(response.status).toBe(201);
    expect(response.body.amount).toBe(250);
    expect(response.body.category).toBe('Test category from Jest');
    expect(response.body.date).toBe('2026-09-20');
  });
  
  test('POST /expenses with empty body returns 400', async () => {
    const response = await request(app)
      .post('/expenses')
      .send({});
    expect(response.status).toBe(400);
  });
});