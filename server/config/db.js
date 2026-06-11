const { Pool } = require('pg')

const isProduction = process.env.NODE_ENV === 'production'

const pool = isProduction
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      task TEXT NOT NULL,
      completed BOOLEAN DEFAULT false
    )
  `)
  console.log('✅ Database connected successfully!')
  console.log("✅ Table 'todos' initialized.")
}

module.exports = { pool, initDB }
