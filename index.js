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

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task, done } = req.body;
  db.prepare('UPDATE todos SET task = ?, done = ? WHERE id = ?').run(task, done, id);
  res.json({ id: Number(id), task, done });
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  res.status(204).send();
});

app.put('/expenses/:id', (req, res) => {
  const { id } = req.params;
  const { amount, category, date } = req.body;
  db.prepare('UPDATE expenses SET amount = ?, category = ?, date = ? WHERE id = ?').run(amount, category, date, id);
  res.json({ id: Number(id), amount, category, date });
});

app.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});