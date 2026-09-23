# AI Shopping Assistant 

A full-stack, AI-powered e-commerce shopping platform built with **React 19**, **TypeScript**, **Node.js/Express**, and **Groq LLM Integration**. Featuring voice search input, context-aware AI recommendations, dual-mode customer support assistance, and a multi-product spec comparison workbench.

---

## Features

-  **AI Shopping Assistant**: Conversational AI tailored for recommending laptops based on budget, performance requirements (gaming, coding, editing), battery life, and portability.
-  **Voice Search & Speech Input**: Integrated browser-native **Web Speech API** for hands-free audio prompt dictation directly into the chat box.
-  **Dual-Mode Customer Support**: Seamless transition between shopping recommendations and customer support / service queries.
-  **Interactive Comparison Workbench**: Compare multiple laptops side-by-side with real-time difference highlighting, spec breakdown, and dynamic counter badges via React Context API (`CompareContext`).
-  **Advanced Filtering & Catalog**: Multi-criteria catalog filtering by price range, brand, processor, RAM, and GPU.
-  **Rich Markdown AI Responses**: Rendered with `react-markdown` and `remark-gfm` for structured spec breakdowns and bullet points.
-  **High Performance Backend**: Node.js + Express backend powered by **Groq Cloud (LLM Engine)** and **Supabase Database** integration.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS (v4), Lucide React Icons
- **Routing**: React Router DOM (v7)
- **State & Context**: React Context API (`CompareContext`)
- **APIs & Markdown**: Web Speech API, Axios, React Markdown, Remark GFM

### Backend
- **Runtime**: Node.js, Express, TypeScript (`tsx`)
- **AI Engine**: Groq SDK (`groq-sdk`)
- **Database / BaaS**: Supabase (`@supabase/supabase-js`)
- **Environment & Middleware**: CORS, Dotenv

---

## 📁 Project Structure

```text
shopping-assistant/
├── frontend/
│   ├── src/
│   │   ├── api/            # API client configurations (Axios)
│   │   ├── components/     # UI components (Navbar, Footer, Product Cards, etc.)
│   │   ├── context/        # CompareContext for cross-page comparison state
│   │   ├── pages/          # Pages (Home, Products, AIShopping, Compare, ProductDetails)
│   │   ├── types/          # TypeScript interfaces for products and chat messages
│   │   └── App.tsx         # Routing configuration
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/         # Environment variables & Supabase/Groq initialization
│   │   ├── routes/         # Express endpoints (/api/chat, /api/products)
│   │   ├── services/       # Groq AI prompt engineering & chat logic
│   │   └── server.ts       # Backend entry point
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **Groq API Key** (Free key from [Groq Console](https://console.groq.com/))
- **Supabase Account & Project** (Optional / Database configuration)

---

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/binuyd/shopping-assistant.git
   cd shopping-assistant
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   GROQ_API_KEY=your_groq_api_key_here
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```
   *(Backend will run on `http://localhost:5000`)*

3. **Frontend Setup**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the `frontend/` directory (if required):
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```
   *(Frontend will run on `http://localhost:5173`)*

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

This project is open source and available under the [MIT License](LICENSE).
