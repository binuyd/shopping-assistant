import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-lg text-white shadow-xs">
            💻
          </span>
          <span>Lap<span className="text-blue-600">Mart</span></span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">

          <Link
            to="/"
            className={`text-sm font-medium transition ${
              isActive('/')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Home
          </Link>

          <Link
            to="/products"
            className={`text-sm font-medium transition ${
              isActive('/products')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Products
          </Link>

          <Link
            to="/compare"
            className={`text-sm font-medium transition ${
              isActive('/compare')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Compare
          </Link>

          <Link
            to="/ai-shopping"
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
              isActive('/ai-shopping')
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <span>✨</span>
            <span>AI Assistant</span>
          </Link>

        </div>

      </div>
    </nav>
  )
}