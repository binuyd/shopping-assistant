import { Link } from 'react-router-dom'
import type { Product } from '../types/product'
import { useCompare } from '../context/CompareContext'
import { Star, Scale, Check, ExternalLink, Cpu, Zap, HardDrive, Battery } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const inCompare = isInCompare(product.id)

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inCompare) {
      removeFromCompare(product.id)
    } else {
      addToCompare(product)
    }
  }

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl">
      
      {/* Top Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">
            💻
          </div>
        )}

        {/* Category Chip */}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
            {product.category || 'Laptop'}
          </span>
        </div>

        {/* Compare Quick Toggle Pill */}
        <button
          onClick={handleCompareClick}
          className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-md transition-all ${
            inCompare
              ? 'bg-emerald-600 text-white'
              : 'bg-white/90 backdrop-blur-md text-slate-700 hover:bg-blue-600 hover:text-white'
          }`}
          title={inCompare ? 'Remove from compare' : 'Add to compare'}
        >
          {inCompare ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>In Compare</span>
            </>
          ) : (
            <>
              <Scale className="h-3.5 w-3.5" />
              <span>+ Compare</span>
            </>
          )}
        </button>
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase text-blue-600 tracking-wide">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 className="mt-1 text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Key Specifications Grid Pills */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {product.cpu && (
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 p-2 text-slate-600 border border-slate-100">
                <Cpu className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                <span className="truncate">{product.cpu}</span>
              </div>
            )}
            {product.ram && (
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 p-2 text-slate-600 border border-slate-100">
                <Zap className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />
                <span>{product.ram} GB RAM</span>
              </div>
            )}
            {product.storage && (
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 p-2 text-slate-600 border border-slate-100">
                <HardDrive className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
                <span>{product.storage} GB SSD</span>
              </div>
            )}
            {product.battery_hours && (
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 p-2 text-slate-600 border border-slate-100">
                <Battery className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                <span>{product.battery_hours}h Battery</span>
              </div>
            )}
          </div>
        </div>

        {/* Price & Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-xl font-extrabold text-slate-900">${product.price}</span>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/products/${product.id}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors"
            >
              <span>Details</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  )
}