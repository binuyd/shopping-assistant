import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { Product } from '../types/product'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'

interface CartItem {
  id: string
  name: string
  price: number | null
  image_url?: string | null
  quantity: number
}

interface ToastMessage {
  id: string
  text: string
  type: 'success' | 'info' | 'warning'
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addToCart: (product: Product) => boolean
  removeFromCart: (id: string) => void
  clearCart: () => void
  toasts: ToastMessage[]
  removeToast: (id: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const hasLoadedUserCart = useRef(false)
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cartItems')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    if (!user) {
      hasLoadedUserCart.current = false
      try {
        const saved = localStorage.getItem('cartItems')
        if (saved) {
          setItems(JSON.parse(saved))
        }
      } catch {
        setItems([])
      }
      return
    }

    const loadUserCart = async () => {
      if (!supabase) {
        return
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Failed to fetch cart items', error)
        return
      }

      const syncedItems: CartItem[] = (data ?? []).map(item => ({
        id: item.product_id,
        name: item.product_name,
        price: item.price,
        image_url: item.image_url,
        quantity: item.quantity,
      }))

      setItems(syncedItems)
      hasLoadedUserCart.current = true
    }

    loadUserCart()
  }, [user])

  const addToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts(prev => [...prev, { id, text, type }])
    setTimeout(() => removeToast(id), 3500)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  useEffect(() => {
    if (user) {
      return
    }

    try {
      localStorage.setItem('cartItems', JSON.stringify(items))
    } catch (error) {
      console.error('Failed to sync cart to localStorage', error)
    }
  }, [items, user])

  useEffect(() => {
    const client = supabase

    if (!user || !client || !hasLoadedUserCart.current) {
      return
    }

    const syncUserCart = async () => {
      const rows = items.map(item => ({
        user_id: user.id,
        product_id: item.id,
        product_name: item.name,
        price: item.price ?? 0,
        image_url: item.image_url ?? null,
        quantity: item.quantity,
      }))

      const { error } = await client.from('cart_items').upsert(rows, {
        onConflict: 'user_id,product_id',
        ignoreDuplicates: false,
      })

      if (error) {
        console.error('Failed to sync cart to Supabase', error)
      }
    }

    syncUserCart()
  }, [items, user])

  const addToCart = (product: Product): boolean => {
    if (!user || !user.id) {
      addToast('Please sign in before adding items to your cart.', 'warning')
      return false
    }

    setItems(prev => {
      const existing = prev.find(item => item.id === product.id)

      if (existing) {
        addToast(`"${product.name}" quantity updated in cart.`, 'success')
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }

      addToast(`"${product.name}" added to cart.`, 'success')
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity: 1,
        },
      ]
    })

    return true
  }

  const removeFromCart = async (id: string) => {
    if (user && supabase) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id)

      if (error) {
        console.error('Failed to remove product from Supabase cart', error)
      }
    }

    setItems(prev => prev.filter(item => item.id !== id))
    addToast('Item removed from cart.', 'info')
  }

  const clearCart = async () => {
    if (user && supabase) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (error) {
        console.error('Failed to clear Supabase cart', error)
      }
    }

    setItems([])
    addToast('Cart cleared.', 'info')
  }

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0),
    [items]
  )

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        clearCart,
        toasts,
        removeToast,
      }}
    >
      {children}
      <div className="fixed bottom-5 left-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-md ${
              toast.type === 'success'
                ? 'border-emerald-700 bg-emerald-900/90 text-emerald-100'
                : toast.type === 'warning'
                  ? 'border-amber-700 bg-amber-900/90 text-amber-100'
                  : 'border-slate-700 bg-slate-900/90 text-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{toast.type === 'success' ? '✓' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
              <span>{toast.text}</span>
              <button onClick={() => removeToast(toast.id)} className="ml-2 opacity-70 hover:opacity-100">
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}
