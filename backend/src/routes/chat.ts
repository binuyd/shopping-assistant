import { Router } from 'express'
import { chat } from '../services/groqService.js'
import type { ChatMessage } from '../types/chat.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    console.log('POST /api/chat received')
    console.log('Request body:', req.body)

    const messages = req.body.messages as ChatMessage[]

    if (!Array.isArray(messages)) {
      res.status(400).json({
        error: 'messages must be an array'
      })
      return
    }

    console.log('Calling chat service...')

    const result = await chat(messages)

    console.log('Chat result:', result)

    res.json(result)

  } catch (error: unknown) {

    console.error(
      '================ CHAT ERROR ================'
    )

    console.dir(error, {
      depth: null
    })

    console.error(
      '============================================'
    )

    res.status(500).json({
      error
    })
  }
})

export default router