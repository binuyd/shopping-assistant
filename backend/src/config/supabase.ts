import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

function isPlaceholderSupabaseKey(value: string | undefined) {
  if (!value) {
    return true
  }

  return /PASTE_|YOUR_|REPLACE_|EXAMPLE_/i.test(value)
}

export function resolveSupabaseKey() {
  const candidates = [
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.SUPABASE_ANON_KEY,
    process.env.SUPABASE_KEY
  ]

  const realKey = candidates.find(
    value => !isPlaceholderSupabaseKey(value)
  )

  return realKey
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = resolveSupabaseKey()

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL is missing')
}

if (!supabaseKey) {
  throw new Error(
    'Supabase key is missing or still contains a placeholder value. Set SUPABASE_KEY, SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY in your backend .env file with the real project key.'
  )
}

const supabase = createClient(
  supabaseUrl,
  supabaseKey
)

export default supabase