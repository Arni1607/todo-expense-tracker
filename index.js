const express = require('express');
const db = require('./db');
const app = express();
const PORT = 3000;

app.get('/todos', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos').all();
  res.json(todos);
});

app.get('/expenses', (req, res) => {
  const expenses = db.prepare('SELECT * FROM expenses').all();
  res.json(expenses);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});