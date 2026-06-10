const { pool } = require('../config/db')

const getTodos = async (req, res) => {
  const result = await pool.query('SELECT * FROM todos ORDER BY id ASC')
  res.json(result.rows)
}

const createTodo = async (req, res) => {
  const { task } = req.body
  const result = await pool.query(
    'INSERT INTO todos (task) VALUES ($1) RETURNING *',
    [task]
  )
  res.status(201).json(result.rows[0])
}

const updateTodo = async (req, res) => {
  const { id } = req.params
  const { task, completed } = req.body
  const result = await pool.query(
    'UPDATE todos SET task=$1, completed=$2 WHERE id=$3 RETURNING *',
    [task, completed, id]
  )
  res.json(result.rows[0])
}

const deleteTodo = async (req, res) => {
  const { id } = req.params
  await pool.query('DELETE FROM todos WHERE id=$1', [id])
  res.json({ message: 'Deleted' })
}

module.exports = { getTodos, createTodo, updateTodo, deleteTodo }
