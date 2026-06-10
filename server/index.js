const express = require('express')
const cors = require('cors')
require('dotenv').config()

const routes = require('./routes/route')
const { initDB } = require('./config/db')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/todos', routes)

initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`)
  })
})
