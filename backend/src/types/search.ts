export interface ProductSearchFilters {
  // Optional filters are combined by the product service when present.
  category?: string
  max_price?: number
  min_ram?: number
  brand?: string
}
