require('dotenv').config();

const express = require('express');
const { pool, initDb } = require('./db');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

initDb().catch(err => {
  console.error('Failed to initialize database:', err.message);
});

app.get('/todos', async (req, res) => {
  const result = await pool.query('SELECT * FROM todos');
  res.json(result.rows);
});

app.get('/expenses', async (req, res) => {
  const result = await pool.query('SELECT * FROM expenses');
  res.json(result.rows);
});

app.post('/todos', async (req, res) => {
  const { task } = req.body;
  if (!task || typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({ error: 'Task is required and must be a non-empty string' });
  }
  const result = await pool.query(
    'INSERT INTO todos (task) VALUES ($1) RETURNING *',
    [task]
  );
  res.status(201).json(result.rows[0]);
});

app.post('/expenses', async (req, res) => {
  const { amount, category, date } = req.body;
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }
  if (!category || typeof category !== 'string' || category.trim() === '') {
    return res.status(400).json({ error: 'Category is required' });
  }
  if (!date || typeof date !== 'string' || date.trim() === '') {
    return res.status(400).json({ error: 'Date is required' });
  }
  const result = await pool.query(
    'INSERT INTO expenses (amount, category, date) VALUES ($1, $2, $3) RETURNING *',
    [amount, category, date]
  );
  res.status(201).json(result.rows[0]);
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { task, done } = req.body;
  if (!task || typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({ error: 'Task is required and must be a non-empty string' });
  }
  const result = await pool.query(
    'UPDATE todos SET task=$1 , done = $2 WHERE id = $3 RETURNING *',
    [task, done, id]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json({ id: Number(id), task, done });
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    'DELETE FROM todos WHERE id = $1',
    [id]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.status(204).send();
});

app.put('/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const { amount, category, date } = req.body;
   if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }
  if (!category || typeof category !== 'string' || category.trim() === '') {
    return res.status(400).json({ error: 'Category is required' });
  }
  if (!date || typeof date !== 'string' || date.trim() === '') {
    return res.status(400).json({ error: 'Date is required' });
  }
  const result = await pool.query(
    'UPDATE expenses SET amount=$1 , category = $2, date= $3 WHERE id = $4 RETURNING *',
    [amount, category, date, id]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Expenses not found' });
  }
  res.json({ id: Number(id), amount, category, date });
});

app.delete('/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    'DELETE FROM expenses WHERE id = $1',
    [id]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Expenses not found' });
  }
  res.status(204).send();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

module.exports = app;