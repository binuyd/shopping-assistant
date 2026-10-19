# 🔨 IMPLEMENTATION GUIDE - Quick Start Code Examples

## Phase 1: Authentication System

### 1.1 Backend Auth Middleware

**File: `backend/src/middleware/auth.ts`**
```typescript
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        error: 'No authorization token provided'
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret'
    ) as { userId: string }

    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({
      error: 'Invalid token'
    })
  }
}
```

### 1.2 Authentication Routes

**File: `backend/src/routes/auth.ts`**
```typescript
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import supabase from '../config/supabase.js'

const router = Router()

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password required'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user into database
    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: hashedPassword,
        name
      })
      .select()
      .single()

    if (error) {
      return res.status(400).json({
        error: error.message
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: data.id },
      process.env.JWT_SECRET || 'your-secret',
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: data.id,
        email: data.email,
        name: data.name
      }
    })
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Registration failed'
    })
  }
})

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password required'
      })
    }

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      })
    }

    // Verify password
    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    )

    if (!validPassword) {
      return res.status(401).json({
        error: 'Invalid credentials'
      })
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret',
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Login failed'
    })
  }
})

export default router
```

### 1.3 Frontend Login Component

**File: `frontend/src/pages/Login.tsx`**
```typescript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LogIn } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password }
      )

      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <LogIn className="text-blue-600" size={32} />
          <h1 className="text-2xl font-bold ml-2">Sign In</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 font-semibold hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  )
}
```

---

## Phase 2: Shopping Cart System

### 2.1 Cart Context

**File: `frontend/src/context/CartContext.tsx`**
```typescript
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import type { Product } from '../types/product'

export interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prev, { ...product, quantity }]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity
  }, 0)

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
```

### 2.2 Shopping Cart Page

**File: `frontend/src/pages/Cart.tsx`**
```typescript
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { Trash2, ArrowLeft } from 'lucide-react'

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-6">
            Add some products to get started!
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Continue Shopping
        </button>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Shopping Cart ({items.length} items)
            </h1>

            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-4 mb-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-gray-600">${item.price?.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="px-3 py-1 text-gray-600"
                    >
                      −
                    </button>
                    <span className="px-4 py-1 border-l border-r">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-3 py-1 text-gray-600"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold w-20">
                    ${((item.price || 0) * item.quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold">$10.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-semibold">
                    ${(total * 0.1).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold text-blue-600">
                  ${(total + 10 + total * 0.1).toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => clearCart()}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Phase 3: Input Validation

### 3.1 Validation Middleware

**File: `backend/src/middleware/validation.ts`**
```typescript
import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body)
      req.body = validated
      next()
    } catch (error: any) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      })
    }
  }
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query)
      req.query = validated
      next()
    } catch (error: any) {
      res.status(400).json({
        error: 'Query validation failed',
        details: error.errors
      })
    }
  }
}
```

### 3.2 Validation Schemas

**File: `backend/src/types/schemas.ts`**
```typescript
import { z } from 'zod'

// Authentication schemas
export const RegisterSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name is required')
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
})

// Product search schema
export const ProductSearchSchema = z.object({
  category: z.string().optional(),
  max_price: z.coerce.number().optional(),
  min_ram: z.coerce.number().optional(),
  brand: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10)
})

// Chat message schema
export const ChatMessageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string()
    })
  )
})

// Cart item schema
export const AddToCartSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1')
})

// Review schema
export const CreateReviewSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(100),
  content: z.string().min(10).max(1000)
})
```

### 3.3 Using Validation in Routes

**Updated: `backend/src/routes/auth.ts`**
```typescript
import { validateBody } from '../middleware/validation.js'
import { RegisterSchema, LoginSchema } from '../types/schemas.js'

router.post(
  '/register',
  validateBody(RegisterSchema),
  async (req, res) => {
    // Now req.body is validated
    const { email, password, name } = req.body
    // ... rest of handler
  }
)

router.post(
  '/login',
  validateBody(LoginSchema),
  async (req, res) => {
    // Now req.body is validated
    const { email, password } = req.body
    // ... rest of handler
  }
)
```

---

## Phase 4: Error Handling

### 4.1 Custom Error Class

**File: `backend/src/utils/AppError.ts`**
```typescript
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational = true
  ) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}

// Specific error types
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409)
  }
}
```

### 4.2 Error Handling Middleware

**File: `backend/src/middleware/errorHandler.ts`**
```typescript
import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError.js'
import { logger } from '../utils/logger.js'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  })

  // Handle AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode
    })
  }

  // Handle unexpected errors
  res.status(500).json({
    error: 'Internal server error',
    statusCode: 500
  })
}

// Async error wrapper
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
```

### 4.3 Using Error Handler

**File: `backend/src/routes/auth.ts`** (Updated)
```typescript
import { asyncHandler } from '../middleware/errorHandler.js'
import { ValidationError, ConflictError } from '../utils/AppError.js'

router.post(
  '/register',
  validateBody(RegisterSchema),
  asyncHandler(async (req, res) => {
    const { email, password, name } = req.body

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      throw new ConflictError('Email already registered')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from('users')
      .insert({ email, password_hash: hashedPassword, name })
      .select()
      .single()

    if (error) {
      throw new ValidationError(error.message)
    }

    const token = jwt.sign(
      { userId: data.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    res.status(201).json({ token, user: data })
  })
)
```

### 4.4 Logger Setup

**File: `backend/src/utils/logger.ts`**
```typescript
import winston from 'winston'

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({ level, message, timestamp }) =>
            `${timestamp} [${level}]: ${message}`
        )
      )
    }),
    // File output
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
})
```

---

## Phase 5: Testing Setup

### 5.1 Backend Test Example

**File: `backend/tests/auth.test.ts`**
```typescript
import request from 'supertest'
import { app } from '../src/server'

describe('Authentication', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('token')
      expect(response.body.user.email).toBe('test@example.com')
    })

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User'
        })

      expect(response.status).toBe(400)
    })

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        })

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User 2'
        })

      expect(response.status).toBe(409)
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        })
    })

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
    })

    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })

      expect(response.status).toBe(401)
    })
  })
})
```

---

## 🎯 NEXT IMMEDIATE ACTIONS

1. **Install new dependencies**:
```bash
cd backend
npm install jsonwebtoken bcryptjs zod express-validator winston dotenv
npm install --save-dev jest @types/jest supertest @types/supertest
```

2. **Update backend `package.json` scripts**:
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

3. **Create database tables** in Supabase:
   - Users table
   - Cart items table
   - Orders table
   - Reviews table

4. **Update `server.ts`** to include:
   - Error handling middleware
   - Auth routes
   - Logger

5. **Create `.env` file** with new variables:
   - `JWT_SECRET`
   - `LOG_LEVEL`
   - `BCRYPT_ROUNDS`

This gives you a solid foundation for Phase 1. Start here and build incrementally! 🚀
