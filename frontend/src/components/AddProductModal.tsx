import { useEffect, useState } from 'react'
import { getProducts } from '../api'
import type { Product } from '../types/product'
import { Search, Plus, Check, Star, X } from 'lucide-react'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectProduct: (product: Product) => void
  currentCompareIds: string[]
}

export default function AddProductModal({
  isOpen,
  onClose,
  onSelectProduct,
  currentCompareIds
}: AddProductModalProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const fetchAll = async () => {
      setLoading(true)
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (e) {
        console.error('Failed to load products for modal', e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [isOpen])

  if (!isOpen) return null

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))] as string[]

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase())) ||
      (p.cpu && p.cpu.toLowerCase().includes(search.toLowerCase()))
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory
    return matchesSearch && matchesCat
  })

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Select Laptop to Compare</h3>
            <p className="text-xs text-slate-500">Pick from our available catalog to compare specs side by side</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, brand, processor..."
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Loading available laptops...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No matching laptops found for your query.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map(p => {
                const isAdded = currentCompareIds.includes(p.id)
                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isAdded
                        ? 'border-blue-200 bg-blue-50/50 opacity-75'
                        : 'border-slate-200 hover:border-blue-500 hover:shadow-md bg-white cursor-pointer'
                    }`}
                    onClick={() => {
                      if (!isAdded) {
                        onSelectProduct(p)
                        onClose()
                      }
                    }}
                  >
                    <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-slate-100 overflow-hidden border border-slate-100">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xl">💻</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold uppercase text-blue-600">{p.brand}</p>
                      <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="font-semibold text-blue-600">${p.price}</span>
                        <span>·</span>
                        <span className="flex items-center text-amber-500">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" />
                          {p.rating}
                        </span>
                        {p.ram && <span>· {p.ram}GB RAM</span>}
                      </div>
                    </div>
                    <div>
                      {isAdded ? (
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                          <Check className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-600 text-slate-600 group-hover:text-white transition">
                          <Plus className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-3 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}
