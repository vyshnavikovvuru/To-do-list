// client/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const user_id = user?.id;

  useEffect(() => {
    if (!token || !user_id) return navigate('/login');
    axios
      .get(`http://localhost:5000/todos?user_id=${user_id}`)
      .then(res => setTodos(res.data))
      .catch(err => console.error('❌ Error fetching todos:', err));
  }, [token, user_id, navigate]);

  const addTodo = async e => {
    e.preventDefault();
    if (!newTitle || !user_id) return;
    try {
      await axios.post('http://localhost:5000/todos', { title: newTitle, user_id });
      setNewTitle('');
      const res = await axios.get(`http://localhost:5000/todos?user_id=${user_id}`);
      setTodos(res.data);
    } catch (err) {
      console.error('❌ Error adding todo:', err);
    }
  };

  const deleteTodo = async id => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('❌ Error deleting todo:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Logout pinned top-right */}
      <button onClick={logout} style={styles.logoutBtn}>Logout</button>

      {/* Main to‑do card */}
      <div style={styles.card}>
        <h2 style={styles.title}>📝 My To‑Do List</h2>

        <form onSubmit={addTodo} style={styles.form}>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="New task..."
            required
            style={styles.input}
          />
          <button type="submit" style={styles.addBtn}>Add</button>
        </form>

        <ul style={styles.list}>
          {todos.map(todo => (
            <li key={todo.id} style={styles.listItem}>
              <span>{todo.title}</span>
              <button onClick={() => deleteTodo(todo.id)} style={styles.removeBtn}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    position: 'relative',
    backgroundColor: '#f2f2f2',
    minHeight: '100vh',
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
  },
  logoutBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '8px 14px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
  },
  title: {
    margin: 0,
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginRight: '10px',
    fontSize: '16px',
  },
  addBtn: {
    padding: '10px 16px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    backgroundColor: '#f9f9f9',
    padding: '10px 15px',
    borderRadius: '6px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #eee',
  },
  removeBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
};

export default App;
