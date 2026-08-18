import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Products from './pages/Products'
import AIShopping from './pages/AIShopping'
import ProductDetails from './pages/ProductDetails'
import Compare from './pages/Compare'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/ai-shopping" element={<AIShopping />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </main>
    </div>
  )
}


export default App