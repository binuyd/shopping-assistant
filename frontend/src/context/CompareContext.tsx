import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Product } from '../types/product'

interface ToastMessage {
  id: string
  text: string
  type: 'success' | 'info' | 'warning'
}

interface CompareContextType {
  compareProducts: Product[]
  addToCompare: (product: Product) => boolean
  removeFromCompare: (id: string) => void
  clearAllCompare: () => void
  isInCompare: (id: string) => boolean
  toasts: ToastMessage[]
  removeToast: (id: string) => void
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareProducts, setCompareProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('compareProducts')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { id, text, type }])
    setTimeout(() => {
      removeToast(id)
    }, 3500)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  useEffect(() => {
    try {
      localStorage.setItem('compareProducts', JSON.stringify(compareProducts))
    } catch (e) {
      console.error('Failed to sync compare products to localStorage', e)
    }
  }, [compareProducts])

  const addToCompare = (product: Product): boolean => {
    if (compareProducts.some(p => p.id === product.id)) {
      addToast(`"${product.name}" is already in your compare list.`, 'warning')
      return false
    }
    if (compareProducts.length >= 3) {
      addToast('You can compare a maximum of 3 products at once.', 'warning')
      return false
    }
    setCompareProducts(prev => [...prev, product])
    addToast(`Added "${product.name}" to compare list.`, 'success')
    return true
  }

  const removeFromCompare = (id: string) => {
    const item = compareProducts.find(p => p.id === id)
    setCompareProducts(prev => prev.filter(p => p.id !== id))
    if (item) {
      addToast(`Removed "${item.name}" from compare list.`, 'info')
    }
  }

  const clearAllCompare = () => {
    setCompareProducts([])
    addToast('Compare list cleared.', 'info')
  }

  const isInCompare = (id: string) => {
    return compareProducts.some(p => p.id === id)
  }

  return (
    <CompareContext.Provider
      value={{
        compareProducts,
        addToCompare,
        removeFromCompare,
        clearAllCompare,
        isInCompare,
        toasts,
        removeToast
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 border-emerald-700 text-emerald-100 shadow-emerald-950/20'
                : toast.type === 'warning'
                ? 'bg-amber-900/90 border-amber-700 text-amber-100 shadow-amber-950/20'
                : 'bg-slate-900/90 border-slate-700 text-slate-100 shadow-slate-950/20'
            }`}
          >
            <span>
              {toast.type === 'success' ? '✓' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span>{toast.text}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-xs opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </CompareContext.Provider>
  )
}

export const useCompare = () => {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider')
  }
  return context
}
