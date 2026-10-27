import { Router } from 'express'
import { chat } from '../services/groqService.js'
import type { ChatMessage } from '../types/chat.js'

const router = Router()

const ALLOWED_ROLES = new Set(['user', 'assistant', 'system'])
const MAX_MESSAGES = 50
const MAX_MESSAGE_LENGTH = 4000

router.post('/', async (req, res) => {
  try {
    const rawMessages = req.body?.messages

    if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
      res.status(400).json({
        error: 'messages must be a non-empty array'
      })
      return
    }

    if (rawMessages.length > MAX_MESSAGES) {
      res.status(400).json({
        error: `messages array exceeds maximum allowed limit of ${MAX_MESSAGES}`
      })
      return
    }

    const sanitizedMessages: ChatMessage[] = []

    for (const msg of rawMessages) {
      if (
        !msg ||
        typeof msg !== 'object' ||
        typeof msg.content !== 'string' ||
        typeof msg.role !== 'string'
      ) {
        res.status(400).json({
          error: 'Each message must have a valid role and string content'
        })
        return
      }

      const role = msg.role.trim().toLowerCase()
      if (!ALLOWED_ROLES.has(role)) {
        res.status(400).json({
          error: `Invalid message role: ${msg.role}`
        })
        return
      }

      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        res.status(400).json({
          error: `Message content exceeds maximum allowed length of ${MAX_MESSAGE_LENGTH} characters`
        })
        return
      }

      sanitizedMessages.push({
        role: role as ChatMessage['role'],
        content: msg.content
      })
    }

    const result = await chat(sanitizedMessages)
    res.json(result)
  } catch (error: unknown) {
    // Log internally for debugging, never leak stack trace or internal details to client
    const errorMessage = error instanceof Error ? error.message : 'Unknown chat error'
    console.error('Chat error occurred:', errorMessage)

    res.status(500).json({
      error: 'Unable to process chat request at this time. Please try again later.'
    })
  }
})

export default router