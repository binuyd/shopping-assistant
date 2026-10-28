import { Router } from 'express'
import { chat } from '../services/groqService.js'
import { checkScope, OUT_OF_SCOPE_REPLY } from '../services/scopeGuard.js'
import type { ChatMessage, ChatResponse } from '../types/chat.js'
import Groq from 'groq-sdk'
import { z } from 'zod'

const router = Router()

const MAX_MESSAGES = 20
const MAX_MESSAGE_LENGTH = 500
const controlCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string()
    .transform(value => value.replace(controlCharacters, '').replace(/\s+/g, ' ').trim())
    .pipe(z.string().min(1).max(MAX_MESSAGE_LENGTH))
}).strict()

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(MAX_MESSAGES)
}).strict()

const scopeClient = new Groq({ apiKey: process.env.GROQ_API_KEY || 'validation-only' })

router.post('/', async (req, res) => {
  try {
    const parsed = chatRequestSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: 'Invalid chat request. Send 1-20 user or assistant messages with 1-500 characters each.'
      })
      return
    }

    const sanitizedMessages: ChatMessage[] = parsed.data.messages
    const scope = await checkScope(sanitizedMessages, scopeClient)
    if (!scope.inScope) {
      const response: ChatResponse = { message: OUT_OF_SCOPE_REPLY, products: [] }
      res.json(response)
      return
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