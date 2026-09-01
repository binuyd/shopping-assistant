import test from 'node:test'
import assert from 'node:assert/strict'
import { isCartAllowed } from './cartAuth.js'

test('blocks cart actions when no authenticated user is present', () => {
  assert.equal(isCartAllowed(null), false)
})

test('allows cart actions when a user is authenticated', () => {
  assert.equal(isCartAllowed({ id: 'user_123', email: 'demo@example.com' }), true)
})
