import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../api'
import ProductCard from '../components/ProductCard'
import type { Product } from '../types/product'
import { useCompare } from '../context/CompareContext'
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Scale, 
  ArrowUpDown, 
  LayoutGrid, 
  List as ListIcon, 
  Laptop,
  X
} from 'lucide-react'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Search & Filter States
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating-desc' | 'ram-desc'>('default')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { compareProducts, clearAllCompare } = useCompare()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        console.error(err)
        setError('Unable to load products. Make sure backend is running.')
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const brands = ['all', ...Array.from(new Set(products.map(p => p.brand).filter(Boolean)))] as string[]
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))] as string[]

  // Filtering & Sorting Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(search.toLowerCase())) ||
      (product.cpu && product.cpu.toLowerCase().includes(search.toLowerCase()))
    
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory

    return matchesSearch && matchesBrand && matchesCategory
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return (a.price ?? 0) - (b.price ?? 0)
    if (sortBy === 'price-desc') return (b.price ?? 0) - (a.price ?? 0)
    if (sortBy === 'rating-desc') return (b.rating ?? 0) - (a.rating ?? 0)
    if (sortBy === 'ram-desc') return (b.ram ?? 0) - (a.ram ?? 0)
    return 0
  })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            <Laptop className="h-4 w-4" />
            <span>Product Catalog</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore All Laptops
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Compare prices, specifications, hardware scores, and user ratings.
          </p>
        </div>

        <Link
          to="/ai-shopping"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all"
        >
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>Ask AI Assistant for Advice</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        
        {/* Search Bar & View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by laptop name, processor, brand..."
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort Selector */}
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50">
              <ArrowUpDown className="h-4 w-4 text-slate-500" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="default">Sort by: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: Highest</option>
                <option value="ram-desc">RAM: Highest</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-slate-200 p-1 bg-slate-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="List View"
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category & Brand Pills */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-400 flex items-center gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Brands:
              </span>
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3 py-1 rounded-lg font-medium capitalize transition ${
                    selectedBrand === brand
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {categories.length > 2 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-400">Categories:</span>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg font-medium capitalize transition ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-slate-400 text-xs">
            Showing <strong className="text-slate-800">{filteredProducts.length}</strong> laptops
          </div>
        </div>

      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
          <p className="mt-3 text-sm font-medium">Fetching catalog items...</p>
        </div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
          {error}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
          <p className="text-base font-semibold text-slate-800">No laptops match your search criteria</p>
          <p className="mt-1 text-xs text-slate-400">Try clearing filters or search terms</p>
          <button
            onClick={() => {
              setSearch('')
              setSelectedBrand('all')
              setSelectedCategory('all')
            }}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "mt-8 space-y-4"}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Floating Compare Bar Notification if Compare items exist */}
      {compareProducts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-md px-6 py-3.5 text-white shadow-2xl transition-all animate-bounce-short">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-xs font-extrabold text-white">
              {compareProducts.length}
            </span>
            <div>
              <p className="text-xs font-bold">Workbench Active</p>
              <p className="text-[11px] text-slate-300">
                {compareProducts.length} of 3 laptops ready to compare
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearAllCompare}
              className="rounded-lg px-2.5 py-1 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
            <Link
              to="/compare"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md transition"
            >
              <Scale className="h-3.5 w-3.5" />
              <span>Compare Now</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  )
}