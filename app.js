require('dotenv').config()
require('express-async-errors')

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// Swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

const express = require('express')
const app = express()

//connectDB
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/auth')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// routes
const authRoutes = require('./routes/auth')
const tasksRoutes = require('./routes/tasks')

app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later'
  })
)

app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(rateLimiter())

app.get('/', (req, res) => {
  res.send('<h1>TASK API</h1><a href="/api-docs">Documentation</a>')
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use('/api/auth', authRoutes)
app.use('/api/tasks', tasksRoutes)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)
app.use(authenticateUser)

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
