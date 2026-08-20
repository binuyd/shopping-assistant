import { Link } from 'react-router-dom'
import { Sparkles, Scale, ArrowRight, Laptop, Cpu, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-16 pb-12">

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white shadow-2xl">
        {/* Glow ambient background elements */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-600/30 blur-3xl"></div>
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"></div>

        <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-24 text-center">
          
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-amber-400 animate-spin-slow" />
            <span>AI-Driven Laptop Intelligence Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Find Your Ideal Laptop with <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Smart AI & Interactive Compare
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300">
            Compare technical specifications side-by-side, highlight spec differences, and let our AI Shopping Assistant find the best match for your budget and workflow.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all transform hover:scale-[1.02]"
            >
              <Laptop className="h-4 w-4" />
              <span>Explore All Laptops</span>
            </Link>

            <Link
              to="/compare"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all"
            >
              <Scale className="h-4 w-4 text-blue-400" />
              <span>Open Compare Workbench</span>
            </Link>

            <Link
              to="/ai-shopping"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 px-6 py-3.5 text-sm font-bold text-amber-200 backdrop-blur-md transition-all"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Ask AI Assistant</span>
            </Link>
          </div>

          {/* Value props */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-400">
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>Difference Highlighting</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>Winner Spec Badges</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>Natural AI Advice</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>Real-time Filtering</span>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Built for Effortless Choice</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Powerful Tools to Choose Your Next Laptop
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto">
            Everything you need to analyze hardware performance and make an informed buying decision.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Card 1 */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Scale className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Side-by-Side Compare</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Compare up to 3 laptops with difference highlighting, CPU/RAM benchmarks, and winner badging for the best value.
            </p>
            <Link to="/compare" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Try Workbench</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Assistant Guidance</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Ask questions in plain English like "Best gaming laptop under $800" and get instant personalized suggestions.
            </p>
            <Link to="/ai-shopping" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Ask AI Assistant</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Hardware Spec Index</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Filter laptops by processor type, RAM capacity, SSD storage, graphics card, battery life, and price range.
            </p>
            <Link to="/products" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
              <span>View All Products</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  )
}