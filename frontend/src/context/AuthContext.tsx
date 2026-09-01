import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = supabase

    if (!client) {
      setLoading(false)
      return
    }

    const loadSession = async () => {
      const { data } = await client.auth.getSession()
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    loadSession()

    const { data: authListener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your frontend .env file.' }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message }
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      return { error: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your frontend .env file.' }
    }

    const { error } = await supabase.auth.signUp({ email, password })
    return { error: error?.message }
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  const value = useMemo<AuthContextType>(() => ({
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }), [user, session, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
