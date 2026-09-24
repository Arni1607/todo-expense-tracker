**Live API:** https://todo-expense-tracker.onrender.com
> Note: hosted on Render's free tier — the first request after a period of inactivity may take 30-60 seconds while the service spins back up.

# To-Do & Expense Tracker API

A simple REST API to manage to-do items and expenses, built from scratch to learn backend fundamentals — no prior software engineering experience going in.

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express** — web framework for routing and middleware
- **SQLite** (via `better-sqlite3`) — lightweight, file-based database
- **dotenv** — environment-based configuration

## Features

- Full CRUD (Create, Read, Update, Delete) for both **todos** and **expenses**
- Input validation on all write operations (required fields, correct types, positive amounts)
- Proper HTTP status codes throughout (`200`, `201`, `204`, `400`, `404`, `500`)
- `404` handling for updates/deletes on non-existent records
- Global error handler to catch unexpected failures gracefully
- Configuration (port) managed via `.env`, kept out of version control

## Getting Started

1. Clone the repo:
   ```
   git clone https://github.com/Arni1607/todo-expense-tracker.git
   cd todo-expense-tracker
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the project root:
   ```
   PORT=4000
   ```
4. Start the server:
   ```
   node index.js
   ```
5. The API will be running at `http://localhost:4000`.

## API Endpoints

### Todos

| Method | Endpoint      | Description                | Body                                 |
|--------|---------------|-----------------------------|---------------------------------------|
| GET    | `/todos`      | Get all todos               | —                                     |
| POST   | `/todos`      | Create a new todo           | `{ "task": "string" }`               |
| PUT    | `/todos/:id`  | Update a todo               | `{ "task": "string", "done": 0/1 }`  |
| DELETE | `/todos/:id`  | Delete a todo               | —                                     |

### Expenses

| Method | Endpoint         | Description             | Body                                                              |
|--------|------------------|---------------------------|--------------------------------------------------------------------|
| GET    | `/expenses`      | Get all expenses          | —                                                                    |
| POST   | `/expenses`      | Create a new expense      | `{ "amount": number, "category": "string", "date": "YYYY-MM-DD" }` |
| PUT    | `/expenses/:id`  | Update an expense         | `{ "amount": number, "category": "string", "date": "YYYY-MM-DD" }` |
| DELETE | `/expenses/:id`  | Delete an expense         | —                                                                    |

## What I Learned

This was my first backend project, built with no prior software engineering knowledge. Along the way I learned:

- How HTTP requests/responses work, and what each HTTP method (GET/POST/PUT/DELETE) is conventionally used for
- REST API design — routes, route parameters, and choosing the correct status code for each situation
- Working with a real database — writing SQL, using prepared statements to prevent SQL injection, and understanding why persistence matters
- Defensive programming — validating input before trusting it, and handling "not found" and unexpected-error cases explicitly
- Separating configuration from code using environment variables
- A daily commit workflow, and testing an API thoroughly (not just the happy path) using Thunder Client