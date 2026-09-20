const request = require('supertest');
const app = require('../app');

describe('Todos API', () => {
  test('GET /todos returns an array', async () => {
    const response = await request(app).get('/todos');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

   test('POST /todos with valid data returns 201', async () => {
    const response = await request(app)
      .post('/todos')
      .send({ task: 'Test task from Jest' });
    expect(response.status).toBe(201);
    expect(response.body.task).toBe('Test task from Jest');
  });

   test('POST /todos with empty body returns 400', async () => {
    const response = await request(app)
      .post('/todos')
      .send({});
    expect(response.status).toBe(400);
  });
});