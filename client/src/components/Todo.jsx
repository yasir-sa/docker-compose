import { useState, useEffect } from 'react'
import API from '../api'
import './Todo.css'

function Todo() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API}/todos`)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(() => setError('Could not connect to the server.'))
      .finally(() => setLoading(false))
  }, [])

  const addTodo = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    fetch(`${API}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: trimmed }),
    })
      .then(res => res.json())
      .then(newTodo => setTodos(prev => [...prev, newTodo]))
    setInput('')
  }

  const deleteTodo = (id) => {
    fetch(`${API}/todos/${id}`, { method: 'DELETE' })
    setTodos(todos.filter(t => t.id !== id))
  }

  const startEdit = (todo) => {
    setEditId(todo.id)
    setEditText(todo.task)
  }

  const saveEdit = () => {
    const trimmed = editText.trim()
    if (!trimmed) return
    const todo = todos.find(t => t.id === editId)
    fetch(`${API}/todos/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: trimmed, completed: todo.completed }),
    })
      .then(res => res.json())
      .then(updated => setTodos(todos.map(t => t.id === editId ? updated : t)))
    setEditId(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditText('')
  }

  const toggleComplete = (todo) => {
    fetch(`${API}/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: todo.task, completed: !todo.completed }),
    })
      .then(res => res.json())
      .then(updated => setTodos(todos.map(t => t.id === todo.id ? updated : t)))
  }

  const handleInputKey = (e) => {
    if (e.key === 'Enter') addTodo()
  }

  const handleEditKey = (e) => {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  const completed = todos.filter(t => t.completed).length

  return (
    <div className="todo-wrapper">
      <div className="todo-card">
        <div className="todo-header">
          <h1>yasir ronaldo  yasir hello  S.A  Todo List</h1>
          <p>{completed} of {todos.length} {todos.length === 1 ? 'task' : 'tasks'} completed</p>
        </div>

        <div className="todo-input-area">
          <input
            type="text"
            className="todo-input"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKey}
          />
          <button className="btn btn-add" onClick={addTodo}>Add</button>
        </div>

        <div className="todo-list">
          {loading && (
            <div className="empty-state">
              <p>Loading tasks...</p>
            </div>
          )}

          {error && (
            <div className="empty-state">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && todos.length === 0 && (
            <div className="empty-state">
              <span>🎉</span>
              <p>All done! Add a new task above.</p>
            </div>
          )}

          {todos.map(todo => (
            <div key={todo.id} className={`todo-item${todo.completed ? ' completed' : ''}`}>
              {editId === todo.id ? (
                <div className="edit-area">
                  <input
                    type="text"
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={handleEditKey}
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button className="btn btn-save" onClick={saveEdit}>Save</button>
                    <button className="btn btn-cancel" onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="todo-left">
                    <input
                      type="checkbox"
                      className="todo-checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo)}
                    />
                    <span className="todo-text">{todo.task}</span>
                  </div>
                  <div className="todo-actions">
                    <button className="btn btn-edit" onClick={() => startEdit(todo)}>Edit</button>
                    <button className="btn btn-delete" onClick={() => deleteTodo(todo.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Todo
