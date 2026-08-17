import supabase from '../config/supabase.js'
import type { Product } from '../types/product.js'
import type { ProductSearchFilters } from '../types/search.js'

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

export async function searchProducts(
  filters: ProductSearchFilters
): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*')

  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  if (filters.max_price !== undefined) {
    query = query.lte('price', filters.max_price)
  }

  if (filters.min_ram !== undefined) {
    query = query.gte('ram', filters.min_ram)
  }

  if (filters.brand) {
    query = query.ilike(
      'brand',
      `%${filters.brand}%`
    )
  }

  const { data, error } = await query
    .order('rating', { ascending: false })
    .limit(6)

  if (error) {
    throw error
  }

  return data as Product[]
}

export async function getProductById(
  id: string
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data as Product
}

export async function compareProducts(
  ids: string[]
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', ids)

  if (error) {
    throw error
  }

  return data as Product[]
}