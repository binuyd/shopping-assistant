import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL
})

export const getProducts = async () => {
  const response = await api.get('/products')
  return response.data
}

export const getProduct = async (id: string) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export const searchProducts = async (
  params: Record<string, unknown>
) => {
  const response = await api.get(
    '/products/search',
    { params }
  )
  return response.data
}

export const sendMessage = async (
  messages: {
    role: 'user' | 'assistant'
    content: string
  }[],
  signal?: AbortSignal
) => {
  const response = await api.post(
    '/chat',
    {
      messages
    },
    { signal, timeout: 25_000 }
  )
  return response.data
}