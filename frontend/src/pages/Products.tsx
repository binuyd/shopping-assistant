import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../api'

interface Product {
  id: string
  name: string
  category: string
  brand: string
  price: number
  ram: number | null
  storage: number | null
  cpu: string | null
  gpu: string | null
  battery_hours: number | null
  rating: number
  stock: number
  description: string | null
  image_url: string | null
}

export default function Products() {

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const loadProducts = async () => {

      try {

        const data = await getProducts()

        setProducts(data)

      } catch (err) {

        console.error(err)

        setError(
          'Unable to load products. Make sure the backend is running.'
        )

      } finally {

        setLoading(false)

      }

    }

    loadProducts()

  }, [])


  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-gray-500">
          Loading products...
        </p>
      </div>
    )
  }


  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">

        <div className="rounded-lg border border-red-200 bg-red-50 p-6">

          <p className="font-medium text-red-700">
            {error}
          </p>

        </div>

      </div>
    )
  }


  return (
    <div className="mx-auto max-w-7xl px-6 py-12">

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-3xl font-bold text-gray-900">
          Products
        </h1>

        <p className="mt-2 text-gray-600">
          Browse our available products.
        </p>

      </div>


      {/* Product count */}
      <div className="mb-6 text-sm text-gray-500">
        {products.length} products available
      </div>


      {/* Products */}
      {products.length === 0 ? (

        <div className="rounded-xl border bg-gray-50 p-12 text-center">

          <p className="text-gray-500">
            No products found.
          </p>

        </div>

      ) : (

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {products.map(product => (

            <div
              key={product.id}
              className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              {/* Image */}
              <div className="h-48 bg-gray-100">

                {product.image_url ? (

                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />

                ) : (

                  <div className="flex h-full items-center justify-center text-gray-400">
                    No image
                  </div>

                )}

              </div>


              {/* Content */}
              <div className="p-5">

                <div className="mb-1 text-xs font-medium uppercase text-blue-600">
                  {product.category}
                </div>

                <h2 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {product.brand}
                </p>


                {/* Specs */}
                <div className="mt-4 space-y-1 text-sm text-gray-600">

                  {product.cpu && (
                    <p>
                      CPU: {product.cpu}
                    </p>
                  )}

                  {product.ram && (
                    <p>
                      RAM: {product.ram} GB
                    </p>
                  )}

                  {product.storage && (
                    <p>
                      Storage: {product.storage} GB
                    </p>
                  )}

                </div>


                {/* Price */}
                <div className="mt-5 flex items-center justify-between">

                  <span className="text-xl font-bold text-blue-600">
                    ${product.price}
                  </span>

                  <span className="text-sm text-yellow-500">
                    ★ {product.rating}
                  </span>

                </div>


                {/* Details & Compare */}
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/products/${product.id}`}
                    className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => {
                      const current = JSON.parse(
                        localStorage.getItem('compareProducts') || '[]'
                      )
                      if (current.some((p: Product) => p.id === product.id)) {
                        alert('This product is already in your compare list.')
                        return
                      }
                      if (current.length >= 3) {
                        alert('You can compare up to 3 products at a time.')
                        return
                      }
                      const updated = [...current, product]
                      localStorage.setItem('compareProducts', JSON.stringify(updated))
                      alert(`${product.name} added to compare list!`)
                    }}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Compare
                  </button>
                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}