import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import productRoutes from './routes/products.js'
import { testGroq } from './services/groqService.js'
import { listModels } from './services/groqService.js'
import chatRoutes from './routes/chat.js'
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/chat', chatRoutes)

app.get('/', (_req, res) => {
  res.json({
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
    console.error(error)

    res.status(500).json({
      error: error instanceof Error
        ? error.message
        : 'Groq request failed'
    })
  }
})

app.use('/api/products', productRoutes)

const PORT = Number(process.env.PORT) || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/api/groq-models', async (_req, res) => {
  try {
    const models = await listModels()

    res.json(models)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: error instanceof Error
        ? error.message
        : 'Failed to retrieve models'
    })
  }
})