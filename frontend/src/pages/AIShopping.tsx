import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { sendMessage } from '../api'

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

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIShopping() {
  const location = useLocation()

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi! 👋 I'm your AI shopping assistant. Tell me what you're looking for and I'll find the best products for you."
    }
  ])

  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (location.state?.compareProducts && Array.isArray(location.state.compareProducts)) {
      setProducts(location.state.compareProducts)
      const names = location.state.compareProducts.map((p: Product) => p.name).join(', ')
      setMessages([
        {
          role: 'assistant',
          content: `I see you are comparing: **${names}**. Ask me any question to help you decide between them!`
        }
      ])
    }
  }, [location.state])

  const [input, setInput] = useState('')

  const [loading, setLoading] = useState(false)

  const handleSend = async () => {

    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim()
    }

    const updatedMessages = [
      ...messages,
      userMessage
    ]

    setMessages(updatedMessages)

    setInput('')

    setLoading(true)

    try {

      const data = await sendMessage(
        updatedMessages
      )

      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: data.reply || data.message || data.content || ''
        }
      ])

      setProducts(data.products || [])

    } catch (error) {

      console.error(
        'AI request failed:',
        error
      )

      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content:
            'Sorry, something went wrong while searching for products. Please try again.'
        }
      ])

    } finally {

      setLoading(false)

    }
  }

  const handleSuggestion = (
    suggestion: string
  ) => {

    setInput(suggestion)

  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">

      {/* Header */}

      <div className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-8">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-2xl">
              🤖
            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                AI Shopping Assistant
              </h1>

              <p className="mt-1 text-gray-500">
                Tell me what you need and I'll find the best products.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* Main */}

      <div className="mx-auto max-w-7xl px-6 py-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">


          {/* Chat */}

          <div className="rounded-2xl border bg-white shadow-sm">

            {/* Chat header */}

            <div className="flex items-center justify-between border-b px-6 py-4">

              <div>

                <h2 className="font-semibold text-gray-900">
                  Shopping Assistant
                </h2>

                <div className="mt-1 flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <span className="text-xs text-gray-500">
                    AI assistant online
                  </span>

                </div>

              </div>

            </div>


            {/* Messages */}

            <div className="h-[520px] overflow-y-auto p-6">

              <div className="flex flex-col gap-5">

                {messages.map(
                  (message, index) => (

                    <div
                      key={index}
                      className={`flex ${message.role === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                        }`}
                    >

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'border bg-gray-50 text-gray-800'
                          }`}
                      >
                        {message.role === 'assistant' ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ children }) => (
                                <h1 className="mb-3 text-xl font-bold text-gray-900">
                                  {children}
                                </h1>
                              ),

                              h2: ({ children }) => (
                                <h2 className="mb-3 mt-4 text-lg font-bold text-gray-900">
                                  {children}
                                </h2>
                              ),

                              h3: ({ children }) => (
                                <h3 className="mb-2 mt-3 font-semibold text-gray-900">
                                  {children}
                                </h3>
                              ),

                              p: ({ children }) => (
                                <p className="mb-3 last:mb-0">
                                  {children}
                                </p>
                              ),

                              strong: ({ children }) => (
                                <strong className="font-bold text-gray-900">
                                  {children}
                                </strong>
                              ),

                              ul: ({ children }) => (
                                <ul className="mb-3 ml-5 list-disc space-y-1">
                                  {children}
                                </ul>
                              ),

                              ol: ({ children }) => (
                                <ol className="mb-3 ml-5 list-decimal space-y-1">
                                  {children}
                                </ol>
                              ),

                              li: ({ children }) => (
                                <li>
                                  {children}
                                </li>
                              ),

                              table: ({ children }) => (
                                <div className="my-4 overflow-x-auto rounded-lg border">
                                  <table className="w-full min-w-[500px] border-collapse text-sm">
                                    {children}
                                  </table>
                                </div>
                              ),

                              thead: ({ children }) => (
                                <thead className="bg-gray-100">
                                  {children}
                                </thead>
                              ),

                              tbody: ({ children }) => (
                                <tbody className="divide-y">
                                  {children}
                                </tbody>
                              ),

                              tr: ({ children }) => (
                                <tr>
                                  {children}
                                </tr>
                              ),

                              th: ({ children }) => (
                                <th className="border-b px-4 py-3 text-left font-semibold text-gray-700">
                                  {children}
                                </th>
                              ),

                              td: ({ children }) => (
                                <td className="px-4 py-3 text-gray-700">
                                  {children}
                                </td>
                              ),

                              code: ({ children }) => (
                                <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs">
                                  {children}
                                </code>
                              )
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          message.content
                        )}
                      </div>

                    </div>

                  )
                )}


                {/* Loading */}

                {loading && (

                  <div className="flex justify-start">

                    <div className="rounded-2xl border bg-gray-50 px-4 py-3">

                      <div className="flex items-center gap-2">

                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />

                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{
                            animationDelay:
                              '150ms'
                          }}
                        />

                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{
                            animationDelay:
                              '300ms'
                          }}
                        />

                        <span className="ml-2 text-sm text-gray-500">
                          Searching products...
                        </span>

                      </div>

                    </div>

                  </div>

                )}

              </div>

            </div>


            {/* Suggestions */}

            <div className="border-t px-6 py-4">

              <p className="mb-3 text-xs font-medium text-gray-500">
                Try asking:
              </p>

              <div className="flex flex-wrap gap-2">

                {[
                  'Laptop under $800 with 16GB RAM',
                  'Best laptop for programming',
                  'Show me Lenovo laptops',
                  'Laptop under $700'
                ].map(
                  suggestion => (

                    <button
                      key={suggestion}
                      onClick={() =>
                        handleSuggestion(
                          suggestion
                        )
                      }
                      className="rounded-full border px-3 py-2 text-xs text-gray-600 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {suggestion}
                    </button>

                  )
                )}

              </div>

            </div>


            {/* Input */}

            <div className="border-t p-4">

              <div className="flex gap-3">

                <input
                  value={input}
                  onChange={e =>
                    setInput(e.target.value)
                  }
                  onKeyDown={e => {

                    if (
                      e.key === 'Enter' &&
                      !e.shiftKey
                    ) {
                      e.preventDefault()
                      handleSend()
                    }

                  }}
                  disabled={loading}
                  placeholder="What are you looking for?"
                  className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />

                <button
                  onClick={handleSend}
                  disabled={
                    loading ||
                    !input.trim()
                  }
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? '...'
                    : 'Send'}
                </button>

              </div>

            </div>

          </div>


          {/* Product results */}

          <div>

            <div className="sticky top-6">

              <div className="mb-4">

                <h2 className="text-xl font-bold text-gray-900">
                  Recommended Products
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Products found by the AI assistant
                </p>

              </div>


              {products.length === 0 ? (

                <div className="rounded-2xl border border-dashed bg-white p-8 text-center">

                  <div className="text-4xl">
                    🛍️
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    No products yet
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Tell the AI what you're looking for and matching products will appear here.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {products.map(
                    product => (

                      <ProductResult
                        key={product.id}
                        product={product}
                      />

                    )
                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}


/* ============================================================
   PRODUCT RESULT
============================================================ */

function ProductResult({
  product
}: {
  product: Product
}) {

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">

      {/* Image */}

      {product.image_url ? (

        <img
          src={product.image_url}
          alt={product.name}
          className="h-44 w-full object-cover"
        />

      ) : (

        <div className="flex h-44 items-center justify-center bg-gray-100 text-4xl">
          💻
        </div>

      )}


      {/* Content */}

      <div className="p-5">

        <div className="flex items-start justify-between gap-3">

          <div>

            <p className="text-xs font-medium uppercase text-blue-600">
              {product.brand}
            </p>

            <h3 className="mt-1 font-bold text-gray-900">
              {product.name}
            </h3>

          </div>

          <span className="whitespace-nowrap text-lg font-bold text-blue-600">
            ${product.price}
          </span>

        </div>


        {/* Rating */}

        <div className="mt-3 flex items-center gap-2 text-sm">

          <span className="text-yellow-500">
            ★
          </span>

          <span className="font-medium">
            {product.rating}
          </span>

        </div>


        {/* Specs */}

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">

          {product.cpu && (
            <div className="rounded-lg bg-gray-50 p-2">
              <span className="block text-gray-400">
                CPU
              </span>

              <span className="font-medium text-gray-700">
                {product.cpu}
              </span>
            </div>
          )}

          {product.ram && (
            <div className="rounded-lg bg-gray-50 p-2">
              <span className="block text-gray-400">
                RAM
              </span>

              <span className="font-medium text-gray-700">
                {product.ram} GB
              </span>
            </div>
          )}

          {product.storage && (
            <div className="rounded-lg bg-gray-50 p-2">
              <span className="block text-gray-400">
                Storage
              </span>

              <span className="font-medium text-gray-700">
                {product.storage} GB
              </span>
            </div>
          )}

          {product.battery_hours && (
            <div className="rounded-lg bg-gray-50 p-2">
              <span className="block text-gray-400">
                Battery
              </span>

              <span className="font-medium text-gray-700">
                {product.battery_hours}h
              </span>
            </div>
          )}

        </div>


        {/* Description */}

        {product.description && (

          <p className="mt-4 line-clamp-2 text-xs leading-5 text-gray-500">
            {product.description}
          </p>

        )}

        {/* Actions */}

        <div className="mt-4 flex gap-2">

          <a
            href={`/products/${product.id}`}
            className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-center text-xs font-medium text-white transition hover:bg-gray-800"
          >
            View Specs
          </a>

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
            className="rounded-lg border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 transition hover:bg-gray-50"
          >
            + Compare
          </button>

        </div>

      </div>

    </div>
  )
}