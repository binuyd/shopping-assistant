import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
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
  }[]
) => {

  const response = await api.post(
    '/chat',
    {
      messages
    }
  )

  return response.data
}