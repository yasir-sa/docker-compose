import { useState } from 'react'
import './Todo.css'

const sampleTodos = [
  { id: 1, text: 'Buy groceries', completed: false },
  { id: 2, text: 'Read a book', completed: true },
  { id: 3, text: 'Go for a walk', completed: false },
]

function Todo() {
  const [todos, setTodos] = useState(sampleTodos)
  const [input, setInput] = useState('')
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')

  const addTodo = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setTodos([...todos, { id: Date.now(), text: trimmed, completed: false }])
    setInput('')
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  const startEdit = (todo) => {
    setEditId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = () => {
    const trimmed = editText.trim()
    if (!trimmed) return
    setTodos(todos.map(t => t.id === editId ? { ...t, text: trimmed } : t))
    setEditId(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditText('')
  }

  const toggleComplete = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
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
          <h1>My Todo List</h1>
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
          {todos.length === 0 && (
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
                      onChange={() => toggleComplete(todo.id)}
                    />
                    <span className="todo-text">{todo.text}</span>
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
