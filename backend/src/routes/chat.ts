import { Router } from 'express'
import { chat } from '../services/groqService.js'
import type { ChatMessage } from '../types/chat.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const messages = req.body.messages as ChatMessage[]

    if (!Array.isArray(messages)) {
      res.status(400).json({
        error: 'messages must be an array'
      })

      return
    }

    const result = await chat(messages)

    res.json(result)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: error instanceof Error
        ? error.message
        : 'Something went wrong'
    })
  }
})

export default router