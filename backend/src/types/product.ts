export interface Product {
  id: string
  name: string
  category: string | null
  brand: string | null
  price: number | null
  ram: number | null
  storage: number | null
  cpu: string | null
  gpu: string | null
  battery_hours: number | null
  rating: number
  stock: number
  description: string | null
  image_url: string | null
  created_at: string
}
