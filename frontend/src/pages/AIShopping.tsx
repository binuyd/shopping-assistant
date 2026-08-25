import { useState, useEffect, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { sendMessage } from '../api'
import { useCompare } from '../context/CompareContext'
import { Scale, Check, Star, Mic, MicOff } from 'lucide-react'

// Declare Web Speech API interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

import type { Product } from '../types/product'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIShopping() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'shopping' | 'customercare'>('shopping')

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi! 👋 I'm your AI shopping assistant. Tell me what you're looking for and I'll find the best products for you."
    }
  ])

  // Handle switching tabs
  const handleTabSwitch = (tab: 'shopping' | 'customercare') => {
    setActiveTab(tab)
    if (tab === 'customercare') {
      setMessages([
        {
          role: 'assistant',
          content:
            "Hello! 🎧 Welcome to Customer Care & Support. How can I help you today? Ask me about order tracking, shipping, returns, warranty, or store policies!"
        }
      ])
    } else {
      setMessages([
        {
          role: 'assistant',
          content:
            "Hi! 👋 I'm your AI shopping assistant. Tell me what you're looking for and I'll find the best products for you."
        }
      ])
    }
  }

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
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('')
        setInput(transcript)
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (err) {
        console.error('Error starting speech recognition:', err)
      }
    }
  }

  const handleSend = async () => {

    if (!input.trim() || loading) return

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }

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

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition ${
                activeTab === 'customercare' ? 'bg-indigo-600 text-white' : 'bg-blue-600 text-white'
              }`}>
                {activeTab === 'customercare' ? '🎧' : '🤖'}
              </div>

              <div>

                <h1 className="text-3xl font-bold text-gray-900">
                  {activeTab === 'customercare' ? 'Customer Care & Support' : 'AI Shopping Assistant'}
                </h1>

                <p className="mt-1 text-gray-500">
                  {activeTab === 'customercare' 
                    ? 'Get 24/7 instant support for orders, returns, warranty & FAQs.'
                    : 'Tell me what you need and I\'ll find the best products.'}
                </p>

              </div>

            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-gray-100 p-1 border border-gray-200">
              <button
                onClick={() => handleTabSwitch('shopping')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === 'shopping'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>🛍️</span>
                <span>Shopping AI</span>
              </button>
              <button
                onClick={() => handleTabSwitch('customercare')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === 'customercare'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>🎧</span>
                <span>Customer Care</span>
              </button>
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
                  {activeTab === 'customercare' ? 'Customer Support Agent' : 'Shopping Assistant'}
                </h2>

                <div className="mt-1 flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <span className="text-xs text-gray-500">
                    {activeTab === 'customercare' ? 'Customer Care AI live' : 'AI assistant online'}
                  </span>

                </div>

              </div>

              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                activeTab === 'customercare' 
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {activeTab === 'customercare' ? '🎧 Customer Support Mode' : '🛍️ Product Finder Mode'}
              </span>

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
                          ? activeTab === 'customercare' ? 'bg-indigo-600 text-white' : 'bg-blue-600 text-white'
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
                          {activeTab === 'customercare' ? 'Checking support policy & assistance...' : 'Searching products...'}
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

                {(activeTab === 'customercare' ? [
                  'What is your return policy?',
                  'How long does shipping take?',
                  'How do I track my order?',
                  'Do products have warranty coverage?'
                ] : [
                  'Laptop under $800 with 16GB RAM',
                  'Best laptop for programming',
                  'Show me Lenovo laptops',
                  'Laptop under $700'
                ]).map(
                  suggestion => (

                    <button
                      key={suggestion}
                      onClick={() =>
                        handleSuggestion(
                          suggestion
                        )
                      }
                      className={`rounded-full border px-3 py-2 text-xs transition ${
                        activeTab === 'customercare'
                          ? 'text-indigo-700 hover:border-indigo-500 hover:bg-indigo-50'
                          : 'text-gray-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600'
                      }`}
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
                  placeholder={
                    isListening
                      ? "Listening... Speak now!"
                      : activeTab === 'customercare'
                      ? "Ask a customer care question (e.g. returns, warranty, shipping)..."
                      : "What are you looking for?"
                  }
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition disabled:bg-gray-100 ${
                    isListening
                      ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200 placeholder-red-400 font-medium'
                      : activeTab === 'customercare'
                      ? 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                      : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                />

                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={loading}
                  title={isListening ? "Stop listening" : "Start voice input"}
                  className={`flex items-center justify-center rounded-xl px-4 py-3 transition ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse hover:bg-red-600'
                      : 'border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={handleSend}
                  disabled={
                    loading ||
                    !input.trim()
                  }
                  className={`rounded-xl px-6 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    activeTab === 'customercare'
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
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
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const inCompare = isInCompare(product.id)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:shadow-md">

      {/* Image */}
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="h-44 w-full object-cover"
        />
      ) : (
        <div className="flex h-44 items-center justify-center bg-slate-100 text-4xl">
          💻
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-blue-600">
              {product.brand}
            </p>
            <h3 className="mt-1 font-bold text-slate-900 line-clamp-1">
              {product.name}
            </h3>
          </div>
          <span className="whitespace-nowrap text-lg font-extrabold text-blue-600">
            ${product.price}
          </span>
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{product.rating}</span>
          <span className="text-slate-400">/ 5</span>
        </div>

        {/* Specs */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {product.cpu && (
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">CPU</span>
              <span className="font-medium text-slate-700 truncate block">{product.cpu}</span>
            </div>
          )}
          {product.ram && (
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">RAM</span>
              <span className="font-medium text-slate-700">{product.ram} GB</span>
            </div>
          )}
          {product.storage && (
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Storage</span>
              <span className="font-medium text-slate-700">{product.storage} GB</span>
            </div>
          )}
          {product.battery_hours && (
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Battery</span>
              <span className="font-medium text-slate-700">{product.battery_hours}h</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            View Specs
          </Link>

          <button
            onClick={() => {
              if (inCompare) {
                removeFromCompare(product.id)
              } else {
                addToCompare(product)
              }
            }}
            className={`flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold transition ${
              inCompare
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {inCompare ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>In Compare</span>
              </>
            ) : (
              <>
                <Scale className="h-3.5 w-3.5 text-slate-500" />
                <span>+ Compare</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}