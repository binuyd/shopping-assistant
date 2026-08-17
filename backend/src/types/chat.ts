import type { Product } from './product.js'

export type MessageRole =
  | 'user'
  | 'assistant'
  | 'system'
  | 'tool'

export interface ChatMessage {
  role: MessageRole
  content: string
}

export interface ChatResponse {
  message: string
  products: Product[]
}