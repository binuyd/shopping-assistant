import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getProduct } from '../api'
import { useCompare } from '../context/CompareContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import type { Product } from '../types/product'
import { 
  ArrowLeft, 
  Scale, 
  Check, 
  Sparkles, 
  Star, 
  Cpu, 
  Zap, 
  HardDrive, 
  Battery, 
  CheckCircle2, 
  XCircle,
  ShieldCheck,
  ShoppingCart
} from 'lucide-react'

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { addToCart } = useCart()
  const { user } = useAuth()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    const loadProduct = async () => {
      try {
        const data = await getProduct(id)
        setProduct(data)
      } catch (err) {
        console.error(err)
        setError('Unable to load product specification details.')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
        <p className="mt-3 text-sm text-slate-500 font-medium">Loading specifications...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
          <p className="font-semibold text-rose-700">{error || 'Product not found.'}</p>
          <Link
            to="/products"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    )
  }

  const inCompare = isInCompare(product.id)

  const askAiAboutThis = () => {
    navigate('/ai-shopping', {
      state: {
        compareProducts: [product]
      }
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      
      {/* Back Link */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Product Catalog</span>
      </Link>

      {/* Main Grid Section */}
      <div className="grid gap-10 lg:grid-cols-2 items-start">

        {/* Left: Hero Image */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative h-[420px] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-100 flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-6xl">💻</div>
            )}
            
            <div className="absolute top-4 left-4">
              <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                {product.category || 'Laptop'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Spec Info & Controls */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              {product.brand}
            </span>

            <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h1>

            {/* Rating & Stock Pill */}
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-xs text-slate-400">/ 5 Rating</span>
              </div>

              <span>·</span>

              <div>
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-0.5 text-xs font-semibold text-rose-800">
                    <XCircle className="h-3.5 w-3.5 text-rose-600" />
                    Out of stock
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-blue-600">${product.price}</span>
              <span className="text-xs text-slate-400">USD</span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Hardware Quick Summary Chips */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {product.cpu && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Cpu className="h-5 w-5 text-blue-600" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Processor</span>
                    <span className="text-xs font-bold text-slate-800 truncate block">{product.cpu}</span>
                  </div>
                </div>
              )}
              {product.ram && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Zap className="h-5 w-5 text-indigo-600" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">System Memory</span>
                    <span className="text-xs font-bold text-slate-800">{product.ram} GB DDR RAM</span>
                  </div>
                </div>
              )}
              {product.storage && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <HardDrive className="h-5 w-5 text-purple-600" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Internal Storage</span>
                    <span className="text-xs font-bold text-slate-800">{product.storage} GB NVMe SSD</span>
                  </div>
                </div>
              )}
              {product.battery_hours && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Battery className="h-5 w-5 text-emerald-600" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Battery Endurance</span>
                    <span className="text-xs font-bold text-slate-800">{product.battery_hours} Hours</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buttons CTA */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (inCompare) {
                  removeFromCompare(product.id)
                } else {
                  addToCompare(product)
                }
              }}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-all shadow-md ${
                inCompare
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
              }`}
            >
              {inCompare ? <Check className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
              <span>{inCompare ? 'In Comparison Workbench' : 'Add to Compare Workbench'}</span>
            </button>

            <button
              type="button"
              onClick={() => addToCart(product)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition ${
                user
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-500'
              }`}
              title={user ? 'Add to cart' : 'Login required to add to cart'}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{user ? 'Add to Cart' : 'Login to Add Cart'}</span>
            </button>

            <button
              onClick={askAiAboutThis}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-5 py-3.5 text-sm font-bold text-indigo-700 transition"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Ask AI About This</span>
            </button>
          </div>

        </div>

      </div>

      {/* Specifications Table */}
      <section className="mt-14 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <span>Full Technical Specifications</span>
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          <SpecRow name="Brand" value={product.brand || 'N/A'} />
          <SpecRow name="Category" value={product.category || 'N/A'} />
          <SpecRow name="Processor (CPU)" value={product.cpu || 'N/A'} />
          <SpecRow name="Memory (RAM)" value={product.ram ? `${product.ram} GB` : 'N/A'} />
          <SpecRow name="Storage (SSD)" value={product.storage ? `${product.storage} GB` : 'N/A'} />
          <SpecRow name="Graphics (GPU)" value={product.gpu || 'N/A'} />
          <SpecRow name="Battery Endurance" value={product.battery_hours ? `${product.battery_hours} hours` : 'N/A'} />
          <SpecRow name="User Rating" value={`${product.rating} / 5 stars`} />
          <SpecRow name="Availability" value={product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'} />
        </div>
      </section>

    </div>
  )
}

function SpecRow({ name, value }: { name: string; value: string }) {
  return (
    <div className="grid grid-cols-3 px-6 py-3.5 text-xs sm:text-sm">
      <span className="font-semibold text-slate-500">{name}</span>
      <span className="col-span-2 font-semibold text-slate-900">{value}</span>
    </div>
  )
}