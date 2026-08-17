import test from 'node:test'
import assert from 'node:assert/strict'

const ORIGINAL_ENV = { ...process.env }

const resetEnv = () => {
  process.env = { ...ORIGINAL_ENV }
}

test('resolveSupabaseKey prefers a valid SUPABASE_SERVICE_ROLE_KEY when the project uses it', async () => {
  resetEnv()

  process.env.SUPABASE_URL = 'https://example.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key-456'
  delete process.env.SUPABASE_KEY
  delete process.env.SUPABASE_ANON_KEY

  const mod = await import('../src/config/supabase.ts')

  assert.equal(mod.resolveSupabaseKey(), 'service-role-key-456')
})

test('resolveSupabaseKey ignores placeholder values and falls back to the real anon key', async () => {
  resetEnv()

  process.env.SUPABASE_URL = 'https://example.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'PASTE_YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE'
  process.env.SUPABASE_ANON_KEY = 'anon-key-123'
  delete process.env.SUPABASE_KEY

  const mod = await import('../src/config/supabase.ts')

  assert.equal(mod.resolveSupabaseKey(), 'anon-key-123')
})

process.on('exit', () => {
  process.env = ORIGINAL_ENV
})
