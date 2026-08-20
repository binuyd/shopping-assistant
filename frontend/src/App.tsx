import { Routes, Route } from 'react-router-dom'
import { CompareProvider } from './context/CompareContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import AIShopping from './pages/AIShopping'
import ProductDetails from './pages/ProductDetails'
import Compare from './pages/Compare'

function App() {
  return (
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
          </Routes>
        </main>
        <Footer />
      </div>
    </CompareProvider>
  )
}

export default App