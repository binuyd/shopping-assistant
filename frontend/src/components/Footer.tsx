import { Link } from 'react-router-dom'
import { Laptop, Sparkles, Scale, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md">
                <Laptop className="h-5 w-5" />
              </span>
              <span>
                Lap<span className="text-blue-400">Mart</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              Next-generation AI-powered shopping platform for laptop selection, interactive side-by-side comparison, and technical specification analysis.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                AI Assistant Online
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  Home Catalog
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  Browse All Laptops
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5 text-blue-400" />
                  Compare Workbench
                </Link>
              </li>
              <li>
                <Link to="/ai-shopping" className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-blue-400 font-medium">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Recommendations
                </Link>
              </li>
            </ul>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Smart Features</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                <span>Specs Visual Benchmarking</span>
              </li>
              <li className="flex items-center gap-2">
                <Scale className="h-3.5 w-3.5 text-blue-400" />
                <span>Difference Highlighting</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Natural Language Queries</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Best Spec Badging System</span>
              </li>
            </ul>
          </div>

          {/* AI Helper Banner */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-800/80 to-slate-900 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Need Buying Advice?</span>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              Compare any laptops or ask our AI assistant to analyze specs for gaming, programming, or everyday office work.
            </p>
            <Link
              to="/ai-shopping"
              className="inline-flex items-center justify-between w-full rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-2 text-xs font-medium text-white transition-all shadow-sm"
            >
              <span>Ask AI Assistant</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LapMart Smart Assistant. Designed for effortless laptop comparisons.</p>
          <div className="flex items-center gap-6">
            <span>Fast Specs Comparison</span>
            <span>·</span>
            <span>Real-time AI Match</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
