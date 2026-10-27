import Groq from 'groq-sdk'
import dotenv from 'dotenv'

import supabase from '../config/supabase.js'
import {
  searchProducts,
  getProductById,
  compareProducts
} from './productService.js'

import type {
  ChatMessage,
  ChatResponse
} from '../types/chat.js'

dotenv.config()

// ============================================================
// GROQ CLIENT
// ============================================================

const apiKey = process.env.GROQ_API_KEY

if (!apiKey) {
  throw new Error('GROQ_API_KEY is missing')
}

const groq = new Groq({
  apiKey
})

// ============================================================
// LIST AVAILABLE MODELS
// ============================================================

export async function listModels() {
  const models = await groq.models.list()

  return models.data.map(model => ({
    id: model.id,
    created: model.created,
    owned_by: model.owned_by
  }))
}

// ============================================================
// TEST GROQ
// ============================================================

export async function testGroq() {
  try {
    const response = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        {
          role: 'user',
          content: 'Say hello in one sentence.'
        }
      ]
    })

    return response.choices[0]?.message?.content ?? ''
  } catch (error) {
    throw error
  }
}

// ============================================================
// AI TOOLS
// ============================================================

const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'search_products',
      description:
        'Search the product database using category, maximum price, minimum RAM, and brand.',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description:
              'Product category such as laptop, phone, or tablet'
          },
          max_price: {
            type: 'number',
            description:
              'Maximum product price in USD'
          },
          min_ram: {
            type: 'number',
            description:
              'Minimum RAM required in GB'
          },
          brand: {
            type: 'string',
            description:
              'Preferred product brand'
          }
        }
      }
    }
  },

  {
    type: 'function' as const,
    function: {
      name: 'get_product_details',
      description:
        'Get complete information about a specific product using either its UUID or its product name.',
      parameters: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string',
            description: 'The UUID of the product'
          },
          product_name: {
            type: 'string',
            description: 'The human-readable product name such as Dell Inspiron 15'
          }
        }
      }
    }
  },

  {
    type: 'function' as const,
    function: {
      name: 'compare_products',
      description:
        'Compare two or more products using their UUIDs or product names.',
      parameters: {
        type: 'object',
        properties: {
          product_ids: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array containing product UUIDs'
          },
          product_names: {
            type: 'array',
            items: {
              type: 'string'
            },
            description:
              'Array containing product names such as ["Dell Inspiron 15", "Lenovo IdeaPad Slim 5"]'
          }
        }
      }
    }
  }
]

// ============================================================
// TOOL ARGUMENT NORMALIZERS & LOOKUP HELPERS
// ============================================================

export function normalizeProductLookupArgs(args: Record<string, unknown>) {
  const productId = typeof args.product_id === 'string' && args.product_id.trim() ? args.product_id.trim() : undefined
  const productName = typeof args.product_name === 'string' && args.product_name.trim() ? args.product_name.trim() : undefined

  return {
    productId,
    productName
  }
}

export function normalizeProductComparisonArgs(args: Record<string, unknown>) {
  const productIds = Array.isArray(args.product_ids)
    ? args.product_ids
        .filter((value): value is string => typeof value === 'string')
        .map(value => value.trim())
        .filter(Boolean)
    : []

  const productNames = Array.isArray(args.product_names)
    ? args.product_names
        .filter((value): value is string => typeof value === 'string')
        .map(value => value.trim())
        .filter(Boolean)
    : []

  return {
    productIds,
    productNames
  }
}

async function resolveProductNameToId(productName: string): Promise<string | null> {
  const cleanName = productName ? productName.trim() : ''
  if (!cleanName) {
    return null
  }

  try {
    // 1. Direct case-insensitive substring match
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .ilike('name', `%${cleanName}%`)
      .limit(1)

    if (!error && data && data.length > 0 && data[0]?.id) {
      return data[0].id
    }

    // 2. Fallback: try individual significant words (e.g. model keywords)
    const words = cleanName.split(/\s+/).filter(w => w.length > 2)
    for (const word of words) {
      const { data: wordData, error: wordErr } = await supabase
        .from('products')
        .select('id')
        .ilike('name', `%${word}%`)
        .limit(1)

      if (!wordErr && wordData && wordData.length > 0 && wordData[0]?.id) {
        return wordData[0].id
      }
    }
  } catch {
    return null
  }

  return null
}

async function resolveProductNamesToIds(productNames: string[]): Promise<string[]> {
  const ids: string[] = []

  for (const productName of productNames) {
    const resolvedId = await resolveProductNameToId(productName)
    if (resolvedId) {
      ids.push(resolvedId)
    }
  }

  return [...new Set(ids)]
}

async function runTool(
  name: string,
  args: Record<string, unknown>
) {
  switch (name) {
    // --------------------------------------------------------
    // SEARCH PRODUCTS
    // --------------------------------------------------------
    case 'search_products': {
      const maxPrice = args.max_price !== undefined && !isNaN(Number(args.max_price))
        ? Number(args.max_price)
        : undefined

      const minRam = args.min_ram !== undefined && !isNaN(Number(args.min_ram))
        ? Number(args.min_ram)
        : undefined

      try {
        return await searchProducts({
          category: typeof args.category === 'string' ? args.category.trim() : undefined,
          max_price: maxPrice,
          min_ram: minRam,
          brand: typeof args.brand === 'string' ? args.brand.trim() : undefined
        })
      } catch {
        return []
      }
    }

    // --------------------------------------------------------
    // GET PRODUCT DETAILS
    // --------------------------------------------------------
    case 'get_product_details': {
      const { productId, productName } = normalizeProductLookupArgs(args)

      let resolvedProductId = productId
      if (!resolvedProductId && productName) {
        resolvedProductId = (await resolveProductNameToId(productName)) ?? undefined
      }

      if (!resolvedProductId) {
        return {
          error: `No product found matching "${productName || productId || 'requested product'}"`
        }
      }

      try {
        return await getProductById(resolvedProductId)
      } catch {
        return {
          error: `Product details could not be retrieved for ${productName || resolvedProductId}`
        }
      }
    }

    // --------------------------------------------------------
    // COMPARE PRODUCTS
    // --------------------------------------------------------
    case 'compare_products': {
      const { productIds, productNames } = normalizeProductComparisonArgs(args)
      const resolvedFromNames = await resolveProductNamesToIds(productNames)
      const resolvedIds = [...new Set([...productIds, ...resolvedFromNames])]

      if (resolvedIds.length === 0) {
        return {
          error: 'No products found for the requested comparison.'
        }
      }

      try {
        return await compareProducts(resolvedIds)
      } catch {
        return {
          error: 'Could not fetch products for comparison.'
        }
      }
    }

    // --------------------------------------------------------
    // UNKNOWN TOOL
    // --------------------------------------------------------
    default:
      return {
        error: `Unknown tool: ${name}`
      }
  }
}

export function buildChatRequest(
  messageList: Array<ChatMessage | { role: 'tool'; tool_call_id: string; content: string } | any>,
  includeTools = true
) {
  const request: any = {
    model: 'openai/gpt-oss-120b',
    messages: messageList
  }

  if (includeTools) {
    request.tools = tools as any
    request.tool_choice = 'auto'
  }

  return request
}

export function buildFallbackAssistantReply(
  products: unknown[],
  userPrompt: string
) {
  if (products.length > 0) {
    return ''
  }

  const promptText = userPrompt.toLowerCase()

  if (promptText.includes('under') || promptText.includes('budget') || promptText.includes('max')) {
    return 'No products matched your budget or filters. I can widen the search or suggest a slightly higher budget range if you want.'
  }

  if (promptText.includes('gaming')) {
    return 'I did not find any gaming laptops that match your current filters. Try widening the price range or checking a few different brands.'
  }

  return 'I did not find any products matching your request. Try widening the filters or tell me more about the type of product you want.'
}

// ============================================================
// CHAT FUNCTION
// ============================================================

export async function chat(
  messages: ChatMessage[]
): Promise<ChatResponse> {
  // ========================================================
  // FIRST GROQ REQUEST
  // ========================================================
  const response = await groq.chat.completions.create(
    buildChatRequest([
      {
        role: 'system',
        content: `
You are an intelligent AI Shopping Assistant for LapMart, our dedicated laptop and technology store.

YOUR RESPONSIBILITIES:
- Help users find the right laptops and tech products based on their budget, specifications, brand preferences, or use-case (such as programming, gaming, creative work, office productivity, or student use).
- Use search_products when searching for laptops with specific filters (brand, max_price, min_ram, category).
- Use get_product_details when the user asks about a specific laptop model or ID.
- Use compare_products when comparing two or more laptops.
- Never invent non-existent products, models, prices, or technical specifications. Always rely strictly on the product data returned by the tools.
- When products are found, clearly explain why they match the user's needs, citing their CPU, RAM, storage, battery life, and price.
- If no products match the user's criteria, clearly state that no matching products were found in our store inventory and politely suggest adjusting filters or budget.

Be warm, professional, concise, and clear in formatting your responses using Markdown.
`
      },
      ...messages
    ])
  )

  const assistantMessage = response.choices[0]?.message

  if (!assistantMessage) {
    throw new Error('No response received from Groq')
  }

  // ========================================================
  // NO TOOL CALL
  // ========================================================
  if (
    !assistantMessage.tool_calls ||
    assistantMessage.tool_calls.length === 0
  ) {
    return {
      message: assistantMessage.content ?? '',
      products: []
    }
  }

  // ========================================================
  // TOOL CALL (Cap execution to max 5 tools)
  // ========================================================
  const toolCallsToExecute = assistantMessage.tool_calls.slice(0, 5)
  const toolResults: unknown[] = []

  for (const toolCall of toolCallsToExecute) {
    const toolName = toolCall.function.name
    let toolArgs: Record<string, unknown> = {}

    try {
      if (toolCall.function.arguments) {
        toolArgs = JSON.parse(toolCall.function.arguments) as Record<string, unknown>
      }
    } catch {
      toolArgs = {}
    }

    try {
      const result = await runTool(toolName, toolArgs)
      toolResults.push(result)
    } catch (err) {
      toolResults.push({
        error: err instanceof Error ? err.message : 'Tool execution failed'
      })
    }
  }

  // ========================================================
  // SECOND GROQ REQUEST
  // ========================================================
  const toolMessages = toolCallsToExecute.map((toolCall, index) => ({
    role: 'tool' as const,
    tool_call_id: toolCall.id,
    content: JSON.stringify(toolResults[index])
  }))

  const finalResponse = await groq.chat.completions.create(
    buildChatRequest([
      {
        role: 'system',
        content: `
You are an AI shopping assistant for LapMart.

Use ONLY the product data returned by the tools.
Do not invent products, prices, ratings, specifications, or features.
Give the user a helpful recommendation based on their requirements.
If multiple products were returned, explain which ones are the best choices and why.
If no products were found, state clearly that nothing matched their search criteria and suggest alternatives or broader filters.
Keep the answer clear, helpful, and concise using Markdown.
`
      },
      ...messages,
      assistantMessage as any,
      ...toolMessages
    ])
  )

  const finalMessage = finalResponse.choices[0]?.message?.content ?? ''

  // ========================================================
  // EXTRACT PRODUCTS
  // ========================================================
  const products = toolResults.flatMap(result => {
    if (Array.isArray(result)) {
      return result
    }
    if (result && typeof result === 'object' && !('error' in result) && 'id' in result) {
      return [result]
    }
    return []
  })

  const fallbackMessage =
    products.length === 0
      ? buildFallbackAssistantReply(products, messages[messages.length - 1]?.content ?? '')
      : finalMessage

  // ========================================================
  // RETURN FINAL RESULT
  // ========================================================
  return {
    message: fallbackMessage || finalMessage,
    products: products as ChatResponse['products']
  }
}