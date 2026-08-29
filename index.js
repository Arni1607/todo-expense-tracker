const express = require('express');
const db = require('./db');
const app = express();
app.use(express.json());
const PORT = 3000;

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
  const result = db.prepare('INSERT INTO todos (task) VALUES (?)').run(task);
  res.status(201).json({ id: result.lastInsertRowid, task, done: 0 });
});

app.post('/expenses', (req, res) => {
  const { amount, category, date } = req.body;
  const result = db.prepare('INSERT INTO expenses (amount, category, date) VALUES (?, ?, ?)').run(amount, category, date);
  res.status(201).json({ id: result.lastInsertRowid, amount, category, date });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});