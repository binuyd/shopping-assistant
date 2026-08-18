import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="mx-auto max-w-3xl text-center">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              <span>✨</span> Powered by LapMart AI Engine
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              Welcome to <span className="text-blue-600">LapMart</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Your one-stop destination for high-performance laptops and tech gear.
              Use our built-in AI Assistant to find your ideal match based on your budget and requirements.
            </p>

            <div className="mt-8 flex justify-center gap-4">

              <Link
                to="/products"
                className="rounded-xl bg-blue-600 px-6 py-3.5 font-medium text-white shadow-xs transition hover:bg-blue-700"
              >
                Explore Laptops
              </Link>

              <Link
                to="/ai-shopping"
                className="rounded-xl border border-blue-200 bg-blue-50 px-6 py-3.5 font-medium text-blue-700 transition hover:bg-blue-100"
              >
                ✨ Try AI Assistant
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="mb-12 text-center">

          <h2 className="text-3xl font-bold text-gray-900">
            Smarter way to shop
          </h2>

          <p className="mt-3 text-gray-600">
            Find products based on what actually matters to you.
          </p>

        </div>


        <div className="grid gap-6 md:grid-cols-3">

          {/* Feature 1 */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl">
              🤖
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              AI Recommendations
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Describe what you need in natural language and
              let AI find products that match your requirements.
            </p>

          </div>


          {/* Feature 2 */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl">
              🔍
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              Smart Search
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Filter products by price, RAM, brand, category
              and other specifications.
            </p>

          </div>


          {/* Feature 3 */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl">
              ⚖️
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              Compare Products
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Compare products side-by-side and understand
              which option best fits your needs.
            </p>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900">

        <div className="mx-auto max-w-7xl px-6 py-16 text-center">

          <h2 className="text-3xl font-bold text-white">
            Need Expert Recommendations?
          </h2>

          <p className="mt-3 text-blue-200">
            Let the LapMart AI Assistant evaluate specs and find the best laptop for your exact budget.
          </p>

          <Link
            to="/ai-shopping"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-medium text-white shadow-md transition hover:bg-blue-500"
          >
            <span>✨</span> Launch AI Assistant
          </Link>

        </div>

      </section>

    </div>
  )
}