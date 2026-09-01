require('dotenv').config();

const express = require('express');
const db = require('./db');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/todos', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos').all();
  res.json(todos);
});

app.get('/expenses', (req, res) => {
  const expenses = db.prepare('SELECT * FROM expenses').all();
  res.json(expenses);
});

app.post('/todos', (req, res) => {
  const { task } = req.body;
  if (!task || typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({ error: 'Task is required and must be a non-empty string' });
  }
  const result = db.prepare('INSERT INTO todos (task) VALUES (?)').run(task);
  res.status(201).json({ id: result.lastInsertRowid, task, done: 0 });
});

app.post('/expenses', (req, res) => {
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
  const result = db.prepare('INSERT INTO expenses (amount, category, date) VALUES (?, ?, ?)').run(amount, category, date);
  res.status(201).json({ id: result.lastInsertRowid, amount, category, date });
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task, done } = req.body;
  if (!task || typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({ error: 'Task is required and must be a non-empty string' });
  }
  const result = db.prepare('UPDATE todos SET task = ?, done = ? WHERE id = ?').run(task, done, id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json({ id: Number(id), task, done });
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.status(204).send();
});

app.put('/expenses/:id', (req, res) => {
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
  const result = db.prepare('UPDATE expenses SET amount = ?, category = ?, date = ? WHERE id = ?').run(amount, category, date, id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Expenses not found' });
  }
  res.json({ id: Number(id), amount, category, date });
});

app.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Expenses not found' });
  }
  res.status(204).send();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});