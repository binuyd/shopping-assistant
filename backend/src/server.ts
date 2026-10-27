import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import productRoutes from './routes/products.js'
import chatRoutes from './routes/chat.js'
import { testGroq, listModels } from './services/groqService.js'

dotenv.config()

const app = express()

// CORS configuration
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL]
  : ['http://localhost:5173', 'http://127.0.0.1:5173']

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true)
      } else {
        callback(new Error('Blocked by CORS policy'))
      }
    },
    credentials: true
  })
)

app.use(express.json({ limit: '1mb' }))

// Routes
app.use('/api/chat', chatRoutes)
app.use('/api/products', productRoutes)

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Shop Backend is running'
  })
})

app.get('/api/test-groq', async (_req, res) => {
  try {
    const response = await testGroq()
    res.json({
      message: response
    })
  } catch (error) {
    console.error('Groq test failure:', error instanceof Error ? error.message : error)
    res.status(500).json({
      error: 'Groq connectivity test failed'
    })
  }
})

app.get('/api/groq-models', async (_req, res) => {
  try {
    const models = await listModels()
    res.json(models)
  } catch (error) {
    console.error('Groq list models failure:', error instanceof Error ? error.message : error)
    res.status(500).json({
      error: 'Failed to retrieve available models'
    })
  }
})

const PORT = Number(process.env.PORT) || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})