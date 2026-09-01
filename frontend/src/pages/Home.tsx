import { Link } from 'react-router-dom'
import { Sparkles, Scale, ArrowRight, Laptop, Cpu, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-16 pb-12">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1022] via-[#0d1638] to-[#1f183e] text-white shadow-[0_25px_80px_rgba(15,23,42,0.55)]">
        <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>AI-Driven Laptop Intelligence Engine</span>
            </div>
          </div>

          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl lg:text-[6rem]">
              Find Your Ideal Laptop with
              <span className="mt-2 block bg-gradient-to-r from-blue-300 via-blue-200 to-violet-300 bg-clip-text text-transparent">
                Smart AI & Interactive Compare
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Compare technical specifications side-by-side, highlight spec differences, and let our AI Shopping Assistant find the best match for your budget and workflow.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(59,130,246,0.4)] transition-transform hover:scale-[1.02]"
              >
                <Laptop className="h-4 w-4" />
                <span>Explore All Laptops</span>
              </Link>

              <Link
                to="/compare"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-slate-700/90"
              >
                <Scale className="h-4 w-4 text-blue-400" />
                <span>Open Compare Workbench</span>
              </Link>

              <Link
                to="/ai-shopping"
                className="inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 px-7 py-3.5 text-sm font-bold text-amber-200 backdrop-blur-md transition hover:from-amber-500/30 hover:to-indigo-500/30"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Ask AI Assistant</span>
              </Link>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 border-t border-slate-700/80 pt-7 text-sm font-semibold text-slate-300 md:grid-cols-4">
            {[
              'Difference Highlighting',
              'Winner Spec Badges',
              'Natural AI Advice',
              'Real-time Filtering'
            ].map((item) => (
              <div key={item} className="flex items-center justify-center gap-2 text-center">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Built for Effortless Choice</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Powerful Tools to Choose Your Next Laptop</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            Everything you need to analyze hardware performance and make an informed buying decision.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <Scale className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Side-by-Side Compare</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Compare up to 3 laptops with difference highlighting, CPU/RAM comparisons, and winner badges for the best value.
            </p>
            <Link to="/compare" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-blue-600 transition-transform group-hover:translate-x-1">
              <span>Try Workbench</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Assistant Guidance</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Ask questions in plain English like “Best gaming laptop under $800” and get instant personalized suggestions.
            </p>
            <Link to="/ai-shopping" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 transition-transform group-hover:translate-x-1">
              <span>Ask AI Assistant</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Hardware Spec Index</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Filter by processor, RAM, SSD, graphics, battery life, price range, and productivity needs.
            </p>
            <Link to="/products" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-violet-600 transition-transform group-hover:translate-x-1">
              <span>View All Products</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}