import test from 'node:test'
import assert from 'node:assert/strict'

const mod = await import('../src/services/groqService.ts')

test('buildChatRequest includes tools and auto tool_choice by default', () => {
  const req = mod.buildChatRequest([
    { role: 'user', content: 'Find a laptop' }
  ])

  assert.equal(req.tool_choice, 'auto')
  assert.ok(Array.isArray(req.tools))
  assert.ok(req.tools.length > 0)
})

test('buildChatRequest can disable tool usage for non-tool completions', () => {
  const req = mod.buildChatRequest([
    { role: 'user', content: 'hello' }
  ], false)

  assert.equal(req.tool_choice, undefined)
  assert.equal(req.tools, undefined)
})

test('buildFallbackAssistantReply explains when no products match', () => {
  const text = mod.buildFallbackAssistantReply([], 'Find me a gaming laptop under 1500')

  assert.match(text, /No products matched|didn.t find|Try widening/i)
})

test('normalizeProductLookupArgs accepts product names as well as ids', () => {
  const lookup = mod.normalizeProductLookupArgs({
    product_name: 'Dell Inspiron 15'
  })

  assert.equal(lookup.productName, 'Dell Inspiron 15')
  assert.equal(lookup.productId, undefined)
})

test('normalizeProductComparisonArgs accepts product names arrays', () => {
  const comparison = mod.normalizeProductComparisonArgs({
    product_names: ['Dell Inspiron 15', 'Lenovo IdeaPad Slim 5']
  })

  assert.deepEqual(comparison.productNames, ['Dell Inspiron 15', 'Lenovo IdeaPad Slim 5'])
  assert.deepEqual(comparison.productIds, [])
})
