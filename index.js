const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST', 'DELETE'] }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Vyshnavi^79',
  database: 'todo_db'
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL Error:', err);
    return;
  }
  console.log('✅ Connected to MySQL');
});

// 🔐 Register route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length > 0) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err) => {
      if (err) return res.status(500).json({ message: 'Insert error' });
      res.status(201).json({ message: 'Registered successfully' });
    });
  });
});

// 🔓 Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    res.status(200).json({ 
      message: 'Login successful', 
      user: { id: user.id, name: user.name, email: user.email } 
    });
  });
});

// Add this route in your backend (server/index.js)
app.get('/todos', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ message: 'Missing user ID' });

  db.query('SELECT * FROM todos WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.status(200).json(results);
  });
});

// Add this POST route as well
// POST /todos - Add a new todo
app.post('/todos', (req, res) => {
  const { title, user_id } = req.body;

  if (!title || !user_id) {
    return res.status(400).json({ message: 'Missing title or user_id' });
  }

  const insertQuery = 'INSERT INTO todos (title, user_id) VALUES (?, ?)';
  db.query(insertQuery, [title, user_id], (err) => {
    if (err) {
      console.error('Error inserting todo:', err);
      return res.status(500).json({ message: 'Error inserting todo' });
    }
    res.status(201).json({ message: 'Todo added successfully' });
  });
});



// ❌ Delete todo by ID
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting todo' });
    res.json({ message: 'Todo deleted successfully' });
  });
});

app.listen(5000, () => {
  console.log('🚀 Server running at http://localhost:5000');
});
