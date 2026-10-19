# 🛒 AI Shopping Assistant

A full-stack, AI-powered e-commerce platform that uses **LLM Function Calling (Agentic Tool Use)** to deliver product recommendations grounded in real database records — not hallucinated specs. Built with **React 19**, **TypeScript**, **Node.js/Express**, **Groq**, and **Supabase**.

> Most AI shopping assistants are chatbots that guess specs. This one answers **only from verified product data**.

---

## 🧠 How the AI Works

Unlike simple prompt → text wrappers, this project implements a **two-turn agentic tool-calling loop**:

```
User: "Find me a laptop under $800 with 16GB RAM for coding"
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│  1st LLM Call: Groq analyzes intent and selects a tool   │
│     → search_products({ max_price: 800, min_ram: 16 })   │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  Tool Execution: Express backend queries Supabase (SQL)  │
│     → Returns real product rows from PostgreSQL          │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│  2nd LLM Call: Groq receives verified data and writes    │
│     a grounded recommendation with real specs & prices   │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
        Frontend renders AI message + interactive product cards
```

### Available AI Tools

| Tool | Purpose | Parameters |
|:-----|:--------|:-----------|
| `search_products` | Query the product catalog | `category`, `max_price`, `min_ram`, `brand` |
| `get_product_details` | Retrieve full specs for a single product | `product_id` or `product_name` |
| `compare_products` | Compare 2+ products side by side | `product_ids[]` or `product_names[]` |

The AI can resolve products by **human-readable name** (e.g. "Dell Inspiron 15") — it doesn't require UUIDs from the user.

---

## ✨ Features

### AI & Chat
- 🤖 **Agentic AI Assistant** — Conversational LLM with function calling that queries real inventory data
- 🎧 **Dual-Mode Chat** — Seamlessly switch between Shopping Assistant and Customer Care & Support (shipping, returns, warranty, store policies)
- 📝 **Rich Markdown Responses** — AI outputs rendered with `react-markdown` + `remark-gfm` for structured spec breakdowns, tables, and bullet points
- 🎙️ **Voice Search** — Hands-free voice input powered by the browser-native Web Speech API

### Shopping & Catalog
- 🔍 **Advanced Filtering** — Filter products by price range, brand, CPU, RAM, and GPU
- ⚖️ **Comparison Workbench** — Compare up to 3 products side-by-side with real-time difference highlighting and best-spec badges
- 🛒 **Shopping Cart** — Full cart system with quantity management, synced to Supabase for logged-in users and localStorage for guests
- 🔐 **Authentication** — Sign up / Sign in via Supabase Auth with session persistence

### UX & Polish
- 🔔 **Toast Notifications** — Context-aware success, warning, and info toasts for cart and compare actions
- 💾 **Persistent State** — Compare list and cart survive page refreshes via localStorage + Supabase sync
- 📱 **Responsive Design** — Mobile-first layout with TailwindCSS v4

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|:-----------|:--------|
| React 19 | UI framework |
| TypeScript | End-to-end type safety |
| Vite 8 | Build tool & dev server |
| TailwindCSS v4 | Utility-first styling |
| React Router v7 | Client-side routing |
| Axios | HTTP client for API calls |
| Lucide React | Icon library |
| React Markdown + Remark GFM | Rendering AI markdown responses |
| Web Speech API | Browser-native voice input |
| Supabase JS | Client-side auth & cart sync |

### Backend
| Technology | Purpose |
|:-----------|:--------|
| Node.js + Express 5 | REST API server |
| TypeScript + tsx | Type-safe development with hot reload |
| Groq SDK | LLM inference with function calling |
| Supabase JS | PostgreSQL database access |
| CORS + Dotenv | Middleware & environment config |

---

## 📁 Project Structure

```
shopping-assistant/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.ts              # Axios client — getProducts, searchProducts, sendMessage
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Top navigation with cart badge & compare counter
│   │   │   ├── Footer.tsx             # Site footer
│   │   │   ├── ProductCard.tsx        # Product display card with compare/cart actions
│   │   │   └── AddProductModal.tsx    # Modal for adding products to compare list
│   │   ├── context/
│   │   │   ├── AuthContext.tsx        # Supabase Auth state (sign in/up/out, session)
│   │   │   ├── CartContext.tsx        # Cart state with Supabase sync + localStorage fallback
│   │   │   └── CompareContext.tsx     # Compare list state (max 3) with toast notifications
│   │   ├── lib/
│   │   │   ├── supabase.ts           # Frontend Supabase client initialization
│   │   │   └── cartAuth.ts           # Cart authentication utilities
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Landing page with hero section & feature cards
│   │   │   ├── Products.tsx          # Browsable product catalog with filters
│   │   │   ├── ProductDetails.tsx    # Single product detail view
│   │   │   ├── AIShopping.tsx        # AI chat interface (shopping + customer care tabs)
│   │   │   ├── Compare.tsx           # Side-by-side comparison workbench
│   │   │   ├── Cart.tsx              # Shopping cart page
│   │   │   └── Auth.tsx              # Login / Register page
│   │   ├── types/
│   │   │   └── product.ts            # Product TypeScript interface
│   │   ├── App.tsx                   # Router setup & context providers
│   │   └── main.tsx                  # App entry point
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.ts           # Supabase client with smart key resolution
│   │   ├── routes/
│   │   │   ├── products.ts           # GET /api/products & /api/products/search
│   │   │   └── chat.ts               # POST /api/chat — receives messages, returns AI response
│   │   ├── services/
│   │   │   ├── groqService.ts        # Core AI engine — tool definitions, two-turn chat loop
│   │   │   └── productService.ts     # Supabase DB queries (search, getById, compare)
│   │   ├── types/
│   │   │   ├── product.ts            # Product interface
│   │   │   ├── chat.ts               # ChatMessage & ChatResponse types
│   │   │   └── search.ts             # ProductSearchFilters interface
│   │   └── server.ts                 # Express app entry point
│   └── package.json
│
├── README.md
├── LICENSE                            # MIT License
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- **Groq API Key** — Free at [console.groq.com](https://console.groq.com/)
- **Supabase Project** — Free at [supabase.com](https://supabase.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/binuyd/shopping-assistant.git
cd shopping-assistant
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000

GROQ_API_KEY=your_groq_api_key_here

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Start the backend:

```bash
npm run dev
```

The server will run on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Optionally create a `.env` file in the `frontend/` directory for auth and cart sync:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** The frontend Supabase config is optional. Without it, auth and cart sync are disabled but the AI chat and product browsing still work fully.

Start the frontend:

```bash
npm run dev
```

The app will run on `http://localhost:5173`.

---

## 🗄️ Database Schema

Create a `products` table in your Supabase project:

| Column | Type | Description |
|:-------|:-----|:------------|
| `id` | `uuid` (PK) | Auto-generated product ID |
| `name` | `text` | Product name |
| `category` | `text` | e.g. `laptop`, `phone`, `tablet` |
| `brand` | `text` | Manufacturer name |
| `price` | `numeric` | Price in USD |
| `ram` | `integer` | RAM in GB |
| `storage` | `integer` | Storage in GB |
| `cpu` | `text` | Processor model |
| `gpu` | `text` | Graphics card |
| `battery_hours` | `numeric` | Battery life in hours |
| `rating` | `numeric` | Product rating (0–5) |
| `stock` | `integer` | Available stock count |
| `description` | `text` | Product description |
| `image_url` | `text` | Product image URL |
| `created_at` | `timestamptz` | Auto-generated timestamp |

For cart sync, create a `cart_items` table:

| Column | Type | Description |
|:-------|:-----|:------------|
| `user_id` | `uuid` (FK) | References `auth.users.id` |
| `product_id` | `uuid` | Product ID |
| `product_name` | `text` | Product name |
| `price` | `numeric` | Price at time of addition |
| `image_url` | `text` | Product image |
| `quantity` | `integer` | Item quantity |
| `created_at` | `timestamptz` | Auto-generated timestamp |

> **Unique constraint** on `(user_id, product_id)` for upsert support.

---

## 🔌 API Reference

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/products` | Get all products, ordered by rating |
| `GET` | `/api/products/search` | Search with query params: `category`, `max_price`, `min_ram`, `brand` |
| `POST` | `/api/chat` | Send chat messages array, returns `{ message, products }` |
| `GET` | `/api/test-groq` | Health check — verifies Groq API connectivity |
| `GET` | `/api/groq-models` | List available Groq models |

### Chat Endpoint Example

**Request:**
```json
POST /api/chat
{
  "messages": [
    { "role": "user", "content": "Find me a gaming laptop under $1500" }
  ]
}
```

**Response:**
```json
{
  "message": "Here are the top gaming laptops under $1500...",
  "products": [
    {
      "id": "uuid-here",
      "name": "ASUS ROG Strix G16",
      "price": 1399,
      "ram": 16,
      "cpu": "Intel i7-13650HX",
      "gpu": "NVIDIA RTX 4060",
      "rating": 4.6
    }
  ]
}
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React 19 / Vite)                │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ ┌───────┐ ┌──────┐  │
│  │   Home   │ │ Products │ │ AI Chat │ │Compare│ │ Cart │  │
│  └──────────┘ └──────────┘ └────┬────┘ └───────┘ └──────┘  │
│                                 │                           │
│              Axios HTTP ────────┤                            │
└─────────────────────────────────┼───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                BACKEND (Express / TypeScript)                │
│                                                             │
│  ┌─────────────┐    ┌──────────────────────────────────┐    │
│  │ /api/products│    │          /api/chat               │    │
│  │  (REST CRUD) │    │                                  │    │
│  └──────┬──────┘    │  1. Send messages to Groq LLM    │    │
│         │           │  2. LLM selects tool + params     │    │
│         │           │  3. Execute tool (DB query)       │    │
│         │           │  4. Feed results back to LLM      │    │
│         │           │  5. Return grounded response      │    │
│         │           └──────────────┬───────────────────┘    │
│         │                          │                        │
│         └──────────┬───────────────┘                        │
│                    │                                        │
└────────────────────┼────────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│   Supabase       │  │    Groq Cloud    │
│  (PostgreSQL)    │  │   (LLM Engine)   │
│                  │  │                  │
│  • products      │  │  • Tool calling  │
│  • cart_items    │  │  • Chat completions│
│  • auth.users    │  │  • Model: GPT-OSS│
└──────────────────┘  └──────────────────┘
```

---

## 🧩 Key Engineering Decisions

| Decision | Rationale |
|:---------|:----------|
| **Two-turn LLM loop** | Ensures AI responses are grounded in real database records, eliminating hallucinated specs and prices |
| **Name-to-ID resolution** | Users can refer to products by name (e.g. "Dell Inspiron 15") — the backend resolves to UUIDs via fuzzy `ILIKE` matching |
| **Dual system prompts** | First call uses a rich system prompt (tool selection); second call uses a strict "use only tool data" prompt to prevent fabrication |
| **Context API over Redux** | Three lightweight contexts (`Auth`, `Cart`, `Compare`) avoid the overhead of an external state library for this scale |
| **localStorage + Supabase sync** | Cart works for guests (localStorage) and persists across devices for authenticated users (Supabase) |
| **Smart Supabase key resolution** | Backend automatically selects the best available key (service role → anon → fallback) and rejects placeholder values |

---

## 📜 Scripts

### Backend

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start dev server with hot reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |

### Frontend

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

Copyright © 2026 Binuwara
