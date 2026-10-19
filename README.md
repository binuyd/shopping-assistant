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

## Features

- 🧠 **AI Shopping Assistant**: Conversational AI tailored for recommending laptops based on budget, performance requirements (gaming, coding, editing), battery life, and portability.
- 🎙️ **Voice Search & Speech Input**: Integrated browser-native **Web Speech API** for hands-free audio prompt dictation directly into the chat box.
- 🎧 **Dual-Mode Customer Support**: Seamless transition between shopping recommendations and customer support / service queries.
- ⚖️ **Interactive Comparison Workbench**: Compare multiple laptops side-by-side with real-time difference highlighting, spec breakdown, and dynamic counter badges via React Context API (`CompareContext`).
- 🔍 **Advanced Filtering & Catalog**: Multi-criteria catalog filtering by price range, brand, processor, RAM, and GPU.
- 📝 **Rich Markdown AI Responses**: Rendered with `react-markdown` and `remark-gfm` for structured spec breakdowns and bullet points.
- ⚡ **High Performance Backend**: Node.js + Express backend powered by **Groq Cloud (LLM Engine)** and **Supabase Database** integration.

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

## Getting Started

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

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/chat` | Sends message history to Groq LLM service and receives AI shopping recommendations |
| `GET` | `/api/products` | Retrieves product catalog from database / fallback repository |
| `GET` | `/api/products/:id` | Retrieves detailed information for a specific product |

---

## 💡 Key Highlights for Portfolio & Resume

- **LLM Integration & Prompt Design**: Implemented server-side prompt engineering using Groq SDK to guarantee structured, accurate product suggestions.
- **Voice User Interface (VUI)**: Built real-time speech recognition hook using browser-native APIs for improved UX accessibility.
- **Complex UI State Management**: Architected global state via React Context for managing product selections, dynamic comparison counters, and modal notifications without external heavy dependencies.

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

Copyright © 2026 Binuwara
