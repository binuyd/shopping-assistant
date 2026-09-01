import { Link } from 'react-router-dom'
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { items, totalItems, totalPrice, removeFromCart, clearCart } = useCart()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Your cart</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Shopping cart</h1>
        </div>
        <Link to="/products" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <ShoppingCart className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your cart is empty</h2>
          <p className="mt-2 text-sm text-slate-500">Add products from the catalog after signing in.</p>
          <Link to="/products" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="h-20 w-20 overflow-hidden rounded-xl bg-slate-100">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">💻</div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">Qty: {item.quantity}</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-extrabold text-blue-600">
                    ${(item.price ?? 0) * item.quantity}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between"><span>Items</span><span>{totalItems}</span></div>
              <div className="flex justify-between"><span>Subtotal</span><span>${totalPrice}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
            </div>
            <div className="mt-5 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between text-lg font-extrabold text-slate-900">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>
            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              Proceed to checkout
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}
