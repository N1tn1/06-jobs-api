require('dotenv').config()
require('express-async-errors')
const express = require('express')
const mongoose = require('mongoose')
const app = express()

//connectDB
const connectDB = require('./db/connect')
// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// routes
const authRoutes = require('./routes/auth')
const tasksRoutes = require('./routes/tasks')

app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api/tasks', tasksRoutes)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
