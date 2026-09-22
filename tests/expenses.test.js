const request = require('supertest');
const app = require('../app');
const { pool } = require('../db');

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

test('PUT /expenses/:id with valid data returns 200 and updates the expense', async () => {
  const created = await request(app)
    .post('/expenses')
    .send({ amount: 100, category: 'test-put', date: '2026-09-22' });

  const id = created.body.id;

  const response = await request(app)
    .put(`/expenses/${id}`)
    .send({ amount: 300, category: 'transport', date: '2026-09-21' });

  expect(response.status).toBe(200);
  expect(response.body.amount).toBe(300);
  expect(response.body.category).toBe('transport');
});

test('PUT /todos/:id with valid data returns 200 and updates the expense', async () => {
  const created = await request(app)
    .post('/todos')
    .send({ task: 'Test put', done: 0 });

  const id = created.body.id;

  const response = await request(app)
    .put(`/todos/${id}`)
    .send({ task: 'Updated task', done: 1 });

  expect(response.status).toBe(200);
  expect(response.body.task).toBe('Updated task');
  expect(response.body.done).toBe(1);
});

afterAll(async () => {
  await pool.end();
});