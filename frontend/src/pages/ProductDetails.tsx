import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct } from '../api'

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

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>()

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!id) return

        const loadProduct = async () => {
            try {
                const data = await getProduct(id)
                setProduct(data)
            } catch (err) {
                console.error(err)
                setError('Unable to load product.')
            } finally {
                setLoading(false)
            }
        }

        loadProduct()
    }, [id])

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-20 text-center">
                <p className="text-gray-500">
                    Loading product...
                </p>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-20">
                <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                    <p className="font-medium text-red-700">
                        {error || 'Product not found.'}
                    </p>

                    <Link
                        to="/products"
                        className="mt-5 inline-block rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white"
                    >
                        Back to Products
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">

            {/* Back */}
            <Link
                to="/products"
                className="mb-8 inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600"
            >
                ← Back to Products
            </Link>

            {/* Main product section */}
            <div className="grid gap-10 lg:grid-cols-2">

                {/* Product image */}
                <div className="overflow-hidden rounded-2xl border bg-gray-50">

                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-[450px] w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-[450px] items-center justify-center text-gray-400">
                            No image available
                        </div>
                    )}

                </div>

                {/* Product information */}
                <div className="flex flex-col justify-center">

                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                        {product.category}
                    </p>

                    <h1 className="mt-2 text-4xl font-bold text-gray-900">
                        {product.name}
                    </h1>

                    <p className="mt-2 text-lg text-gray-500">
                        {product.brand}
                    </p>

                    {/* Rating */}
                    <div className="mt-5 flex items-center gap-2">
                        <span className="text-yellow-500">
                            ★
                        </span>

                        <span className="font-semibold text-gray-900">
                            {product.rating}
                        </span>

                        <span className="text-gray-500">
                            / 5
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mt-6">
                        <span className="text-4xl font-bold text-blue-600">
                            ${product.price}
                        </span>
                    </div>

                    {/* Description */}
                    {product.description && (
                        <p className="mt-6 leading-7 text-gray-600">
                            {product.description}
                        </p>
                    )}

                    {/* Stock */}
                    <div className="mt-6">
                        {product.stock > 0 ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                In stock · {product.stock} available
                            </span>
                        ) : (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                                Out of stock
                            </span>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="mt-8">
                        <button
                            className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99]"
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
                        >
                            Add to Compare List
                        </button>
                    </div>

                </div>
            </div>

            {/* Specifications */}
            <section className="mt-16">

                <h2 className="text-2xl font-bold text-gray-900">
                    Specifications
                </h2>

                <div className="mt-6 overflow-hidden rounded-xl border">

                    <div className="divide-y">

                        {product.cpu && (
                            <Specification
                                name="Processor"
                                value={product.cpu}
                            />
                        )}

                        {product.ram && (
                            <Specification
                                name="RAM"
                                value={`${product.ram} GB`}
                            />
                        )}

                        {product.storage && (
                            <Specification
                                name="Storage"
                                value={`${product.storage} GB`}
                            />
                        )}

                        {product.gpu && (
                            <Specification
                                name="Graphics"
                                value={product.gpu}
                            />
                        )}

                        {product.battery_hours && (
                            <Specification
                                name="Battery"
                                value={`${product.battery_hours} hours`}
                            />
                        )}

                        <Specification
                            name="Brand"
                            value={product.brand}
                        />

                        <Specification
                            name="Category"
                            value={product.category}
                        />

                        <Specification
                            name="Rating"
                            value={`${product.rating} / 5`}
                        />

                    </div>

                </div>

            </section>

        </div>
    )
}

function Specification({
    name,
    value
}: {
    name: string
    value: string
}) {
    return (
        <div className="grid grid-cols-2 px-6 py-4">

            <span className="font-medium text-gray-500">
                {name}
            </span>

            <span className="text-gray-900">
                {value}
            </span>

        </div>
    )
}