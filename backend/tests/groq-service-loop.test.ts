import test from 'node:test'
import assert from 'node:assert/strict'
import Groq from 'groq-sdk'
import supabase from '../src/config/supabase.ts'
import type { ChatCompletionMessageToolCall } from 'groq-sdk/resources/chat/completions.js'

process.env.GROQ_REQUEST_TIMEOUT_MS = '10'
process.env.GROQ_RETRY_DELAY_MS = '1'
process.env.GROQ_MAX_TOOL_ITERATIONS = '3'

const groqService = await import('../src/services/groqService.ts')
const groqProbe = new Groq({ apiKey: 'test-key' })
const completionsPrototype = Object.getPrototypeOf(groqProbe.chat.completions) as {
  create: (...args: never[]) => Promise<unknown>
}

function toolCall(name: string, argumentsText = '{}'): ChatCompletionMessageToolCall {
  return {
    id: `call-${name}`,
    type: 'function',
    function: { name, arguments: argumentsText }
  }
}

function toolResponse(name = 'unknown_tool') {
  return {
    choices: [{
      message: {
        role: 'assistant',
        content: null,
        tool_calls: [toolCall(name)]
      }
    }]
  }
}

test('chat stops after the configured maximum tool iterations', async t => {
  let calls = 0
  t.mock.method(completionsPrototype, 'create', async () => {
    calls += 1
    return toolResponse() as never
  })

  const result = await groqService.chat([{ role: 'user', content: 'Find a laptop.' }])

  assert.equal(calls, 3)
  assert.match(result.message, /could not complete|did not find|matching laptops/i)
})

test('chat aborts a Groq request on timeout and returns a friendly fallback', async t => {
  let receivedSignal: AbortSignal | undefined
  t.mock.method(completionsPrototype, 'create', async (_request, options) => {
    receivedSignal = options?.signal
    await new Promise<never>((_resolve, reject) => {
      receivedSignal?.addEventListener('abort', () => {
        const error = new Error('aborted')
        error.name = 'AbortError'
        reject(error)
      })
    })
  })

  const result = await groqService.chat([{ role: 'user', content: 'Find a laptop.' }])

  assert.equal(receivedSignal?.aborted, true)
  assert.match(result.message, /could not complete.*try again/i)
})

test('chat handles an empty product search result with a fallback message', async t => {
  const originalFrom = supabase.from
  const query = {
    eq: () => query,
    lte: () => query,
    gte: () => query,
    ilike: () => query,
    order: () => query,
    limit: async () => ({ data: [], error: null })
  }
  const emptyQuery = {
    select: () => query
  }
  supabase.from = (() => emptyQuery) as typeof supabase.from

  let calls = 0
  t.mock.method(completionsPrototype, 'create', async () => {
    calls += 1
    if (calls === 1) {
      return {
        choices: [{
          message: {
            role: 'assistant',
            content: null,
            tool_calls: [toolCall('search_products', '{"category":"laptop"}')]
          }
        }]
      } as never
    }
    return {
      choices: [{ message: { role: 'assistant', content: '' } }]
    } as never
  })

  try {
    const result = await groqService.chat([
      { role: 'user', content: 'Find a laptop under my budget.' }
    ])
    assert.match(result.message, /No laptops matched|did not find/i)
    assert.deepEqual(result.products, [])
  } finally {
    supabase.from = originalFrom
  }
})

test('chat retries one 429 response and returns a fallback when it still fails', async t => {
  let calls = 0
  t.mock.method(completionsPrototype, 'create', async () => {
    calls += 1
    const error = new Error('rate limited') as Error & { status: number }
    error.status = 429
    throw error
  })

  const result = await groqService.chat([{ role: 'user', content: 'Find a laptop.' }])

  assert.equal(calls, 2)
  assert.match(result.message, /could not complete.*try again/i)
  assert.deepEqual(result.products, [])
})
