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
  // The UI uses these records to render product cards alongside the answer.
  message: string
  products: Product[]
}

export interface ClientChatMessage {
  role: 'user' | 'assistant'
  content: string
}
