import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

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

export default function Compare() {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        const saved = JSON.parse(
            localStorage.getItem('compareProducts') || '[]'
        )

        setProducts(saved)
    }, [])

    const removeProduct = (id: string) => {
        const updated = products.filter(
            product => product.id !== id
        )

        setProducts(updated)

        localStorage.setItem(
            'compareProducts',
            JSON.stringify(updated)
        )
    }

    const clearAll = () => {
        setProducts([])

        localStorage.removeItem('compareProducts')
    }

    if (products.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-20 text-center">

                <h1 className="text-3xl font-bold text-gray-900">
                    Compare Products
                </h1>

                <p className="mt-3 text-gray-500">
                    Add products to compare them side by side.
                </p>

                <Link
                    to="/products"
                    className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                >
                    Browse Products
                </Link>

            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Compare Products
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Compare up to 3 products side by side.
                    </p>
                </div>

                <button
                    onClick={clearAll}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                    Clear All
                </button>

            </div>

            {/* Comparison table */}

            <div className="mt-8 overflow-x-auto rounded-xl border">

                <table className="w-full min-w-[700px] border-collapse">

                    <thead>

                        <tr className="bg-gray-50">

                            <th className="w-40 border-b p-4 text-left text-sm font-semibold text-gray-600">
                                Specification
                            </th>

                            {products.map(product => (
                                <th
                                    key={product.id}
                                    className="border-b p-4 text-left"
                                >

                                    {product.image_url && (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="mb-4 h-32 w-full rounded-lg object-cover"
                                        />
                                    )}

                                    <div className="text-lg font-bold text-gray-900">
                                        {product.name}
                                    </div>

                                    <div className="mt-1 text-sm text-gray-500">
                                        {product.brand}
                                    </div>

                                    <button
                                        onClick={() => removeProduct(product.id)}
                                        className="mt-3 text-sm text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>

                                </th>
                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        <ComparisonRow
                            label="Price"
                            products={products}
                            getValue={product => `$${product.price}`}
                        />

                        <ComparisonRow
                            label="Rating"
                            products={products}
                            getValue={product => `★ ${product.rating}`}
                        />

                        <ComparisonRow
                            label="Processor"
                            products={products}
                            getValue={product => product.cpu || 'N/A'}
                        />

                        <ComparisonRow
                            label="RAM"
                            products={products}
                            getValue={product =>
                                product.ram
                                    ? `${product.ram} GB`
                                    : 'N/A'
                            }
                        />

                        <ComparisonRow
                            label="Storage"
                            products={products}
                            getValue={product =>
                                product.storage
                                    ? `${product.storage} GB`
                                    : 'N/A'
                            }
                        />

                        <ComparisonRow
                            label="Graphics"
                            products={products}
                            getValue={product => product.gpu || 'N/A'}
                        />

                        <ComparisonRow
                            label="Battery"
                            products={products}
                            getValue={product =>
                                product.battery_hours
                                    ? `${product.battery_hours} hours`
                                    : 'N/A'
                            }
                        />

                        <ComparisonRow
                            label="Stock"
                            products={products}
                            getValue={product =>
                                product.stock > 0
                                    ? `${product.stock} available`
                                    : 'Out of stock'
                            }
                        />

                    </tbody>

                </table>

            </div>

            {/* AI recommendation */}

            {products.length >= 2 && (
                <div className="mt-8 rounded-xl border bg-blue-50 p-6">

                    <h2 className="text-xl font-bold text-gray-900">
                        🤖 Need help choosing?
                    </h2>

                    <p className="mt-2 text-gray-600">
                        Let our AI shopping assistant analyze these
                        products and recommend the best option for you.
                    </p>

                    <Link
                        to="/ai-shopping"
                        state={{ compareProducts: products }}
                        className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                    >
                        Ask AI to Compare
                    </Link>

                </div>
            )}

        </div>
    )
}

function ComparisonRow({
    label,
    products,
    getValue
}: {
    label: string
    products: Product[]
    getValue: (product: Product) => string
}) {
    return (
        <tr className="border-b last:border-b-0">

            <td className="bg-gray-50 p-4 text-sm font-semibold text-gray-600">
                {label}
            </td>

            {products.map(product => (
                <td
                    key={product.id}
                    className="p-4 text-sm text-gray-800"
                >
                    {getValue(product)}
                </td>
            ))}

        </tr>
    )
}