import axios from 'axios'
import type { Product } from '../types/product'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products')

  return response.data
}

export const searchProducts = async (
  params: Record<string, string | number>
): Promise<Product[]> => {
  const response = await api.get<Product[]>(
    '/products/search',
    { params }
  )

  return response.data
}