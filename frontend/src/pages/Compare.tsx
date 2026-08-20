import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import AddProductModal from '../components/AddProductModal'
import type { Product } from '../types/product'
import { 
  Sparkles, 
  Trash2, 
  PlusCircle, 
  ArrowLeftRight, 
  CheckCircle2, 
  Trophy, 
  Cpu, 
  HardDrive, 
  Zap, 
  BatteryCharging, 
  Star, 
  ShoppingBag,
  ExternalLink,
  Layers
} from 'lucide-react'

export default function Compare() {
  const { compareProducts, removeFromCompare, clearAllCompare, addToCompare } = useCompare()
  const [highlightDifferences, setHighlightDifferences] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  // Calculate Best Specs across selected compare products
  const lowestPrice = compareProducts.length > 0 ? Math.min(...compareProducts.map(p => p.price ?? Infinity)) : null
  const highestRam = compareProducts.length > 0 ? Math.max(...compareProducts.map(p => p.ram ?? 0)) : null
  const highestStorage = compareProducts.length > 0 ? Math.max(...compareProducts.map(p => p.storage ?? 0)) : null
  const highestBattery = compareProducts.length > 0 ? Math.max(...compareProducts.map(p => p.battery_hours ?? 0)) : null
  const highestRating = compareProducts.length > 0 ? Math.max(...compareProducts.map(p => p.rating ?? 0)) : null

  // Function to check if values in a row differ
  const checkHasDifference = (keyGetter: (p: Product) => string | number | null | undefined) => {
    if (compareProducts.length < 2) return false
    const firstVal = keyGetter(compareProducts[0])
    return compareProducts.some(p => keyGetter(p) !== firstVal)
  }

  const hasPriceDiff = checkHasDifference(p => p.price)
  const hasRamDiff = checkHasDifference(p => p.ram)
  const hasStorageDiff = checkHasDifference(p => p.storage)
  const hasCpuDiff = checkHasDifference(p => p.cpu)
  const hasGpuDiff = checkHasDifference(p => p.gpu)
  const hasBatteryDiff = checkHasDifference(p => p.battery_hours)
  const hasRatingDiff = checkHasDifference(p => p.rating)

  const slots = [0, 1, 2] // Always support 3 columns

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            <ArrowLeftRight className="h-4 w-4" />
            <span>Interactive Comparison Workbench</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Compare Laptops Side-by-Side
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Analyze specifications, benchmark performance metrics, and find your best laptop match.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-3">
          {compareProducts.length > 1 && (
            <button
              onClick={() => setHighlightDifferences(!highlightDifferences)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all border ${
                highlightDifferences
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Layers className="h-4 w-4 text-indigo-600" />
              <span>{highlightDifferences ? 'Highlighting Differences ON' : 'Highlight Differences'}</span>
            </button>
          )}

          {compareProducts.length > 0 && (
            <button
              onClick={clearAllCompare}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Workbench</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Comparison Area */}
      <div className="mt-8">
        
        {compareProducts.length === 0 ? (
          /* Empty Workbench State */
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-gradient-to-b from-slate-50 to-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100/70 text-blue-600 shadow-inner">
              <ArrowLeftRight className="h-10 w-10" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-slate-900">Your Compare Workbench is Empty</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
              Add up to 3 laptops to compare technical specifications, ratings, graphics, and performance metrics side by side.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-500"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Select Laptops to Compare</span>
              </button>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Browse Products Catalog</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Comparison Cards & Grid */
          <div className="space-y-8">
            
            {/* Top AI Decision Helper Card */}
            {compareProducts.length >= 2 && (
              <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/30 border border-blue-400/30 px-3 py-1 text-xs font-semibold text-blue-200 backdrop-blur-md">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" />
                      <span>Instant AI Comparison Analysis</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Confused about which laptop fits your needs best?</h3>
                    <p className="text-xs text-blue-200 max-w-xl">
                      Let LapMart AI analyze these {compareProducts.length} models for gaming, video editing, battery efficiency, or budget value.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/ai-shopping', { state: { compareProducts } })}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                  >
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>Ask AI Assistant to Compare</span>
                  </button>
                </div>
              </div>
            )}

            {/* Laptop Product Column Cards (Header Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {slots.map(index => {
                const product = compareProducts[index]

                if (!product) {
                  return (
                    <div
                      key={`empty-slot-${index}`}
                      onClick={() => setIsModalOpen(true)}
                      className="group flex min-h-[340px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center transition-all hover:border-blue-500 hover:bg-blue-50/30"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-400 shadow-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <PlusCircle className="h-7 w-7" />
                      </div>
                      <h4 className="mt-4 text-sm font-bold text-slate-800 group-hover:text-blue-600">
                        + Add Slot #{index + 1}
                      </h4>
                      <p className="mt-1 text-xs text-slate-400">
                        Click to select another laptop to compare
                      </p>
                    </div>
                  )
                }

                const isBestValue = product.price === lowestPrice && compareProducts.length > 1
                const isTopRated = product.rating === highestRating && compareProducts.length > 1

                return (
                  <div
                    key={product.id}
                    className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                  >
                    {/* Top Badge & Delete */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isBestValue && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                            <Trophy className="h-3 w-3 text-emerald-600" />
                            Best Value
                          </span>
                        )}
                        {isTopRated && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            Top Rated
                          </span>
                        )}
                        {!isBestValue && !isTopRated && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-slate-600">
                            {product.brand}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Remove from comparison"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Image */}
                    <div className="my-4 h-44 w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-100 flex items-center justify-center">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="text-4xl">💻</div>
                      )}
                    </div>

                    {/* Details Header */}
                    <div>
                      <span className="text-[11px] font-semibold uppercase text-blue-600 tracking-wide">
                        {product.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1 mt-0.5">
                        {product.name}
                      </h3>
                      
                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold text-blue-600">${product.price}</span>
                        <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                          <span className="text-xs text-slate-400">/ 5</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA Links */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                      <Link
                        to={`/products/${product.id}`}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition flex items-center justify-center gap-1"
                      >
                        <span>Full Specs</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Detailed Side-by-Side Comparison Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-600" />
                  <span>Technical Specification Matrix</span>
                </h3>
                <span className="text-xs text-slate-500">
                  Showing {compareProducts.length} of 3 laptops
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-sm">
                  <tbody>

                    {/* Price Row */}
                    <TableRow
                      icon={<ShoppingBag className="h-4 w-4 text-emerald-600" />}
                      label="Price"
                      hasDifference={highlightDifferences && hasPriceDiff}
                      products={compareProducts}
                      renderCell={p => {
                        const isLowest = p.price === lowestPrice && compareProducts.length > 1
                        return (
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">${p.price}</span>
                            {isLowest && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                💰 Lowest Price
                              </span>
                            )}
                          </div>
                        )
                      }}
                    />

                    {/* Processor CPU */}
                    <TableRow
                      icon={<Cpu className="h-4 w-4 text-blue-600" />}
                      label="Processor (CPU)"
                      hasDifference={highlightDifferences && hasCpuDiff}
                      products={compareProducts}
                      renderCell={p => (
                        <span className="font-medium text-slate-800">{p.cpu || 'N/A'}</span>
                      )}
                    />

                    {/* Memory RAM */}
                    <TableRow
                      icon={<Zap className="h-4 w-4 text-indigo-600" />}
                      label="RAM Memory"
                      hasDifference={highlightDifferences && hasRamDiff}
                      products={compareProducts}
                      renderCell={p => {
                        const isHighest = p.ram === highestRam && compareProducts.length > 1 && (p.ram ?? 0) > 0
                        const ramVal = p.ram ?? 0
                        const maxRam = highestRam || 64
                        const percentage = Math.min(100, Math.round((ramVal / maxRam) * 100))

                        return (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{p.ram ? `${p.ram} GB RAM` : 'N/A'}</span>
                              {isHighest && (
                                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                                  ⚡ Max RAM
                                </span>
                              )}
                            </div>
                            {p.ram && (
                              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className="h-full bg-indigo-600 rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            )}
                          </div>
                        )
                      }}
                    />

                    {/* Storage SSD */}
                    <TableRow
                      icon={<HardDrive className="h-4 w-4 text-purple-600" />}
                      label="SSD Storage"
                      hasDifference={highlightDifferences && hasStorageDiff}
                      products={compareProducts}
                      renderCell={p => {
                        const isHighest = p.storage === highestStorage && compareProducts.length > 1 && (p.storage ?? 0) > 0
                        return (
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-800">
                              {p.storage ? `${p.storage} GB SSD` : 'N/A'}
                            </span>
                            {isHighest && (
                              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                💾 Max Storage
                              </span>
                            )}
                          </div>
                        )
                      }}
                    />

                    {/* Graphics GPU */}
                    <TableRow
                      icon={<Cpu className="h-4 w-4 text-cyan-600" />}
                      label="Graphics (GPU)"
                      hasDifference={highlightDifferences && hasGpuDiff}
                      products={compareProducts}
                      renderCell={p => (
                        <span className="font-medium text-slate-800">{p.gpu || 'Integrated'}</span>
                      )}
                    />

                    {/* Battery Life */}
                    <TableRow
                      icon={<BatteryCharging className="h-4 w-4 text-emerald-600" />}
                      label="Battery Backup"
                      hasDifference={highlightDifferences && hasBatteryDiff}
                      products={compareProducts}
                      renderCell={p => {
                        const isHighest = p.battery_hours === highestBattery && compareProducts.length > 1 && (p.battery_hours ?? 0) > 0
                        return (
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-800">
                              {p.battery_hours ? `${p.battery_hours} hours` : 'N/A'}
                            </span>
                            {isHighest && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                🔋 Longest Battery
                              </span>
                            )}
                          </div>
                        )
                      }}
                    />

                    {/* Rating */}
                    <TableRow
                      icon={<Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                      label="User Rating"
                      hasDifference={highlightDifferences && hasRatingDiff}
                      products={compareProducts}
                      renderCell={p => {
                        const isTop = p.rating === highestRating && compareProducts.length > 1
                        return (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <span>★ {p.rating}</span>
                              <span className="text-xs text-slate-400">/ 5</span>
                            </div>
                            {isTop && (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                                ⭐ Highest Rated
                              </span>
                            )}
                          </div>
                        )
                      }}
                    />

                    {/* Stock Availability */}
                    <TableRow
                      icon={<CheckCircle2 className="h-4 w-4 text-slate-500" />}
                      label="Stock Availability"
                      hasDifference={false}
                      products={compareProducts}
                      renderCell={p => (
                        <div>
                          {p.stock > 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                              In Stock ({p.stock} units)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500">
                              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                              Out of Stock
                            </span>
                          )}
                        </div>
                      )}
                    />

                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProduct={(product) => addToCompare(product)}
        currentCompareIds={compareProducts.map(p => p.id)}
      />

    </div>
  )
}

function TableRow({
  icon,
  label,
  hasDifference,
  products,
  renderCell
}: {
  icon: React.ReactNode
  label: string
  hasDifference: boolean
  products: Product[]
  renderCell: (p: Product) => React.ReactNode
}) {
  const slots = [0, 1, 2]

  return (
    <tr className={`border-b border-slate-100 transition-colors ${hasDifference ? 'bg-amber-50/40' : ''}`}>
      <td className="w-48 bg-slate-50/70 p-4 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
          {hasDifference && (
            <span className="ml-auto rounded bg-amber-200/60 px-1.5 py-0.5 text-[9px] font-bold text-amber-900 uppercase">
              Diff
            </span>
          )}
        </div>
      </td>

      {slots.map(index => {
        const product = products[index]
        return (
          <td key={index} className="p-4 border-l border-slate-100">
            {product ? renderCell(product) : <span className="text-slate-300 text-xs italic">—</span>}
          </td>
        )
      })}
    </tr>
  )
}