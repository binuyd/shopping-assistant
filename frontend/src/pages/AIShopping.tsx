import { useState, useEffect, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { sendMessage } from '../api'
import { useCompare } from '../context/CompareContext'
import { Scale, Check, Star, Mic, MicOff, Bot, Sparkles, Send } from 'lucide-react'
import type { Product } from '../types/product'

interface SpeechRecognitionEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>
}

interface SpeechRecognitionInstance {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: { error: string }) => void
  onend: () => void
  start: () => void
  stop: () => void
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  }
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIShopping() {
  const location = useLocation()

  const initialCompare =
    location.state?.compareProducts && Array.isArray(location.state.compareProducts)
      ? (location.state.compareProducts as Product[])
      : null

  const [products, setProducts] = useState<Product[]>(() => initialCompare ?? [])

  const [messages, setMessages] = useState<Message[]>(() => {
    if (initialCompare && initialCompare.length > 0) {
      const names = initialCompare.map(p => p.name).join(', ')
      return [
        {
          role: 'assistant',
          content: `I see you are comparing: **${names}**. Ask me any question to help you decide between them!`
        }
      ]
    }
    return [
      {
        role: 'assistant',
        content:
          "Hi! 👋 I'm your AI shopping assistant. Tell me what kind of laptop you're looking for (budget, specs, brand, or use-case) and I'll find the best options for you!"
      }
    ]
  })

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechWarning, setSpeechWarning] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  // Initialize Speech Recognition if available
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map(result => result[0]?.transcript ?? '')
            .join('')
          setInput(transcript)
        }

        recognition.onerror = (event: { error: string }) => {
          setIsListening(false)
          if (event.error !== 'no-speech') {
            setSpeechWarning(`Voice error: ${event.error}`)
            setTimeout(() => setSpeechWarning(null), 4000)
          }
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      } catch {
        recognitionRef.current = null
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechWarning('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
      setTimeout(() => setSpeechWarning(null), 4500)
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        setSpeechWarning(null)
        recognitionRef.current.start()
        setIsListening(true)
      } catch {
        setIsListening(false)
        setSpeechWarning('Could not start microphone. Check browser permissions.')
        setTimeout(() => setSpeechWarning(null), 4000)
      }
    }
  }

  const handleSend = async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput || loading) return

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }

    const userMessage: Message = {
      role: 'user',
      content: trimmedInput
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const data = await sendMessage(updatedMessages)

      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: data.reply || data.message || data.content || 'Here are some recommendations based on your request.'
        }
      ])

      if (Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products)
      }
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue while searching for laptops. Please try again or refine your query.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  const shoppingSuggestions = [
    'Laptop under $800 with 16GB RAM',
    'Best laptop for programming & coding',
    'Show me Lenovo laptops',
    'Lightweight laptop with long battery life',
    'Gaming laptop with dedicated GPU under $1200'
  ]

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                    AI Shopping Assistant
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    Interactive
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Ask specs, compare options, and find laptops matched to your budget and workload.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>AI Product Engine Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Chat Section */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Chat Status Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-bold text-xs">
                  AI
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Laptop Recommendation Chat</h2>
                  <p className="text-xs text-slate-500">Powered by tool-calling & specification search</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
                🛍️ Laptop Finder
              </span>
            </div>

            {/* Warning banner for speech recognition if triggered */}
            {speechWarning && (
              <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center justify-between transition-all">
                <span>{speechWarning}</span>
                <button
                  type="button"
                  onClick={() => setSpeechWarning(null)}
                  className="font-bold text-amber-900 hover:text-black ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Messages Scroll View */}
            <div className="h-[520px] overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-xs ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                        : 'border border-slate-200 bg-slate-50 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => (
                            <h1 className="mb-2 text-lg font-bold text-slate-900">{children}</h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="mb-2 mt-3 text-base font-bold text-slate-900">{children}</h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="mb-1 mt-2 text-sm font-semibold text-slate-900">{children}</h3>
                          ),
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => (
                            <ul className="mb-2 list-disc pl-5 space-y-1">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="mb-2 list-decimal pl-5 space-y-1">{children}</ol>
                          ),
                          li: ({ children }) => <li>{children}</li>,
                          strong: ({ children }) => (
                            <strong className="font-semibold text-slate-900">{children}</strong>
                          ),
                          code: ({ children }) => (
                            <code className="rounded bg-slate-200 px-1 py-0.5 text-xs text-slate-800">
                              {children}
                            </code>
                          )
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <span className="whitespace-pre-wrap">{message.content}</span>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-xs">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '300ms' }} />
                    <span className="ml-2 text-xs font-medium text-slate-500">Searching laptops & specs...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Chips */}
            <div className="border-t border-slate-100 bg-slate-50/40 px-6 py-3.5">
              <p className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Suggested queries:
              </p>
              <div className="flex flex-wrap gap-2">
                {shoppingSuggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestion(suggestion)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 shadow-2xs"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="border-t border-slate-200 p-4 bg-white">
              <div className="flex gap-2 sm:gap-3">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  disabled={loading}
                  placeholder={
                    isListening
                      ? 'Listening... Speak now!'
                      : 'Ask for laptops, budgets, specs, or recommendations...'
                  }
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition disabled:bg-slate-100 ${
                    isListening
                      ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200 placeholder-red-400 font-medium'
                      : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                />

                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={loading}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                  className={`flex items-center justify-center rounded-xl px-3.5 py-3 transition ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse hover:bg-red-600'
                      : 'border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Results Side Panel */}
          <div>
            <div className="sticky top-24">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">Recommended Laptops</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {products.length > 0
                    ? `Found ${products.length} laptop${products.length > 1 ? 's' : ''} from your conversation`
                    : 'Matched products will appear here automatically'}
                </p>
              </div>

              {products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-xs">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600 mb-3">
                    💻
                  </div>
                  <h3 className="font-bold text-slate-800">No products yet</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 max-w-xs mx-auto">
                    Type a query or tap one of the suggested prompts to see real-time specs and recommendations.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
                  {products.map(product => (
                    <ProductResult key={product.id} product={product} />
                  ))}
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
   PRODUCT RESULT CARD
============================================================ */

function ProductResult({ product }: { product: Product }) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const inCompare = isInCompare(product.id)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:shadow-md">
      {/* Image */}
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="flex h-40 items-center justify-center bg-slate-100 text-3xl">
          💻
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              {product.brand}
            </p>
            <h3 className="mt-0.5 font-bold text-slate-900 line-clamp-1 text-sm">
              {product.name}
            </h3>
          </div>
          <span className="whitespace-nowrap text-base font-extrabold text-blue-600">
            ${product.price}
          </span>
        </div>

        {/* Rating */}
        <div className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-slate-700">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{product.rating}</span>
          <span className="text-slate-400">/ 5</span>
        </div>

        {/* Specs */}
        <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
          {product.cpu && (
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="block text-[9px] text-slate-400 font-bold uppercase">CPU</span>
              <span className="font-medium text-slate-700 truncate block text-xs">{product.cpu}</span>
            </div>
          )}
          {product.ram && (
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="block text-[9px] text-slate-400 font-bold uppercase">RAM</span>
              <span className="font-medium text-slate-700 text-xs">{product.ram} GB</span>
            </div>
          )}
          {product.storage && (
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="block text-[9px] text-slate-400 font-bold uppercase">Storage</span>
              <span className="font-medium text-slate-700 text-xs">{product.storage} GB</span>
            </div>
          )}
          {product.battery_hours && (
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="block text-[9px] text-slate-400 font-bold uppercase">Battery</span>
              <span className="font-medium text-slate-700 text-xs">{product.battery_hours}h</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            View Specs
          </Link>

          <button
            type="button"
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