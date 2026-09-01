import { Routes, Route } from 'react-router-dom'
import { CompareProvider } from './context/CompareContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import AIShopping from './pages/AIShopping'
import ProductDetails from './pages/ProductDetails'
import Compare from './pages/Compare'
import AuthPage from './pages/Auth'
import CartPage from './pages/Cart'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CompareProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/ai-shopping" element={<AIShopping />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/cart" element={<CartPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CompareProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App