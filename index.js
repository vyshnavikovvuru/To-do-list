const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',  // Allow requests from React dev server
  methods: ['GET', 'POST', 'DELETE'],
}));



const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       
    password: 'Vyshnavi^79',
    database: 'todo_db' 
});

db.connect(err => {
    if (err) {
        console.error('MySQL Connection Error:', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.get('/todos', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.post('/todos', (req, res) => {
    const { title, completed = false } = req.body;
    const sql = 'INSERT INTO todos (title, completed) VALUES (?, ?)';
    db.query(sql, [title, completed], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'ToDo added', id: result.insertId });
    });
});
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'ToDo not found' });
    res.json({ message: 'ToDo deleted successfully' });
  });
});


const PORT = process.env.PORT || 5000;  

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
