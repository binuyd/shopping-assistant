import { Link } from 'react-router-dom'
import { Sparkles, Scale, ArrowRight, Laptop, Cpu, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-16 pb-12">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1022] via-[#0d1638] to-[#1f183e] text-white shadow-[0_25px_80px_rgba(15,23,42,0.55)]">
        <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>AI laptop shopping</span>
            </div>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-[4rem]">
              Find the right laptop
              <span className="mt-2 block bg-gradient-to-r from-blue-300 via-blue-200 to-violet-300 bg-clip-text text-transparent">
                with smart AI help
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Compare specs, check differences, and get quick recommendations for your budget and work style.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.4)] transition-transform hover:scale-[1.02]"
              >
                <Laptop className="h-4 w-4" />
                <span>Explore laptops</span>
              </Link>

              <Link
                to="/compare"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-slate-700/90"
              >
                <Scale className="h-4 w-4 text-blue-400" />
                <span>Compare</span>
              </Link>

              <Link
                to="/ai-shopping"
                className="inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 px-5 py-3 text-sm font-semibold text-amber-200 backdrop-blur-md transition hover:from-amber-500/30 hover:to-indigo-500/30"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Ask AI</span>
              </Link>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 border-t border-slate-700/80 pt-5 text-xs font-medium text-slate-300 md:grid-cols-4">
            {[
              'Spec compare',
              'Best picks',
              'AI advice',
              'Smart filters'
            ].map((item) => (
              <div key={item} className="flex items-center justify-center gap-2 text-center">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-600">Simple tools</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Choose your next laptop with less hassle</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            Compare options, check key specs, and get quick recommendations.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Compare</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Check up to 3 laptops side by side and see the key differences.
            </p>
            <Link to="/compare" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600 transition-transform group-hover:translate-x-1">
              <span>Open compare</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">AI help</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Ask simple questions and get recommendations that fit your needs.
            </p>
            <Link to="/ai-shopping" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 transition-transform group-hover:translate-x-1">
              <span>Try AI</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Search specs</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Filter by CPU, RAM, storage, battery, and price in seconds.
            </p>
            <Link to="/products" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-violet-600 transition-transform group-hover:translate-x-1">
              <span>Browse products</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}