import supabase from '../config/supabase'
import type { Product } from '../types/product'

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('rating', { ascending: false })

  if (error) {
    throw error
  }

  return data as Product[]
}