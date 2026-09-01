import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const navigate = useNavigate()
  const { signIn, signUp, user } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  if (user) {
    return null
  }

  const submitAuth = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const action = mode === 'signin' ? signIn : signUp
    const result = await action(email, password)

    if (result.error) {
      setMessage(result.error)
      setLoading(false)
      return
    }

    setMessage(
      mode === 'signup'
        ? 'Account created successfully. Please check your email to confirm the sign-up if required.'
        : 'Signed in successfully.'
    )
    setLoading(false)
    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-16 sm:px-6">
      <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">LapMart</p>
            <h1 className="mt-4 text-3xl font-extrabold">Welcome back</h1>
            <p className="mt-4 max-w-sm text-sm text-blue-100">
              Sign in to unlock cart access and save your favorite laptop picks.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-blue-50">
            Browsing is open to everyone, but cart actions require an account.
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Account</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {mode === 'signin' ? 'Need an account?' : 'Have an account?'}
            </button>
          </div>

          <form onSubmit={submitAuth} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                placeholder="At least 6 characters"
              />
            </div>

            {message && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Or <Link to="/products" className="font-semibold text-blue-600 hover:text-blue-500">continue browsing</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
