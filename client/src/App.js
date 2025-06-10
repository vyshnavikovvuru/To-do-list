
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await axios.get('/todos');

      setTodos(res.data);
    };
    fetchTodos();
  }, []);

 const addTodo = async e => {
  e.preventDefault();
  if (!newTitle) return;

  try {
    await axios.post('http://localhost:5000/todos', { title: newTitle });
    setNewTitle('');
    const res = await axios.get('http://localhost:5000/todos');
    setTodos(res.data);
  } catch (err) {
    console.error('Error adding todo:', err);
  }
};const deleteTodo = async (id) => {
  const cleanId = String(id).trim();

  try {
    await axios.delete(`/todos/${cleanId}`);
    setTodos(prev => prev.filter(t => t.id !== Number(cleanId)));
    console.log(`Removed todo with id ${cleanId}`);
  } catch (err) {
    console.error('Error deleting todo:', err);
  }
};



  return (
    <div style={{padding: '20px', maxWidth: 600, margin: 'auto'}}>
      <h2>My To‑Do List</h2>
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="New task"
          style={{width: '80%', padding: '8px'}}
        />
        <button type="submit" style={{padding: '8px 12px', marginLeft: '8px'}}>Add</button>
      </form>
      <ul style={{listStyle: 'none', padding: 0, marginTop: '20px'}}>
        {todos.map(todo => (
          <li key={todo.id} style={{marginBottom: '10px'}}>
            {todo.title}
            <button
              type="button"    
  className="remove-btn"
  onClick={() =>{deleteTodo(todo.id);
    console.log("Clicked delete for:", todo.id);
  } } 
>
  Remove
</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
