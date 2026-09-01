import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Laptop, Sparkles, Scale, Grid, Home as HomeIcon, ShoppingCart, LogIn, LogOut } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { compareProducts } = useCompare()
  const { user, signOut } = useAuth()
  const { totalItems } = useCart()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        <Link
          to="/"
          className="flex items-center gap-2.5 group text-xl font-bold tracking-tight text-slate-900 transition"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Laptop className="h-5 w-5" />
          </span>
          <span className="font-extrabold tracking-tight">
            Lap<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Mart</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-6">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              isActive('/')
                ? 'text-blue-600 bg-blue-50/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <HomeIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <Link
            to="/products"
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              isActive('/products')
                ? 'text-blue-600 bg-blue-50/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Grid className="h-4 w-4" />
            <span>Products</span>
          </Link>

          <Link
            to="/compare"
            className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              isActive('/compare')
                ? 'text-blue-600 bg-blue-50/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Scale className="h-4 w-4" />
            <span>Compare</span>
            {compareProducts.length > 0 && (
              <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white shadow-xs animate-pulse">
                {compareProducts.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              isActive('/cart')
                ? 'text-blue-600 bg-blue-50/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white shadow-xs animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            to="/ai-shopping"
            className={`ml-1 sm:ml-2 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all shadow-xs ${
              isActive('/ai-shopping')
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/25 shadow-md'
                : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/60'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-500 animate-spin-slow" />
            <span>AI Assistant & Care</span>
          </Link>

          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}