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
    active: model.active,
    context_window: model.context_window
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

    console.log('Groq response:', response)

    return response.choices[0]?.message?.content ?? ''

  } catch (error) {
    console.error('GROQ ERROR:', error)
    throw error
  }
}

// ============================================================
// DEBUG - CHECK API KEY
// ============================================================

console.log(
  'Groq key loaded:',
  process.env.GROQ_API_KEY
    ? `${process.env.GROQ_API_KEY.slice(0, 7)}...`
    : 'NO KEY'
)

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
// RUN TOOL
// ============================================================

export function normalizeProductLookupArgs(args: Record<string, unknown>) {
  const productId = typeof args.product_id === 'string' ? args.product_id : undefined
  const productName = typeof args.product_name === 'string' ? args.product_name.trim() : undefined

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

async function resolveProductNameToId(productName: string) {
  if (!productName) {
    return null
  }

  const { data, error } = await supabase
    .from('products')
    .select('id')
    .ilike('name', `%${productName}%`)
    .limit(1)

  if (error) {
    throw error
  }

  return data?.[0]?.id ?? null
}

async function resolveProductNamesToIds(productNames: string[]) {
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
  console.log('Running tool:', name)
  console.log('Tool arguments:', args)

  switch (name) {

    // --------------------------------------------------------
    // SEARCH PRODUCTS
    // --------------------------------------------------------

    case 'search_products':

      return await searchProducts({
        category:
          args.category as string | undefined,

        max_price:
          args.max_price !== undefined
            ? Number(args.max_price)
            : undefined,

        min_ram:
          args.min_ram !== undefined
            ? Number(args.min_ram)
            : undefined,

        brand:
          args.brand as string | undefined
      })

    // --------------------------------------------------------
    // GET PRODUCT DETAILS
    // --------------------------------------------------------

    case 'get_product_details': {
      const { productId, productName } = normalizeProductLookupArgs(args)

      const resolvedProductId =
        productId ??
        (productName ? await resolveProductNameToId(productName) : null)

      if (!resolvedProductId) {
        throw new Error(
          `No product found for ${productName ?? productId ?? 'the requested product'}`
        )
      }

      return await getProductById(resolvedProductId)
    }

    // --------------------------------------------------------
    // COMPARE PRODUCTS
    // --------------------------------------------------------

    case 'compare_products': {
      const { productIds, productNames } = normalizeProductComparisonArgs(args)
      const resolvedIds = [
        ...new Set([
          ...productIds,
          ...(await resolveProductNamesToIds(productNames))
        ])
      ]

      if (resolvedIds.length === 0) {
        throw new Error(
          'No products found for the requested comparison.'
        )
      }

      return await compareProducts(resolvedIds)
    }

    // --------------------------------------------------------
    // UNKNOWN TOOL
    // --------------------------------------------------------

    default:

      throw new Error(
        `Unknown tool: ${name}`
      )
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

  try {

    // ========================================================
    // FIRST GROQ REQUEST
    // ========================================================

    const response =
      await groq.chat.completions.create(
        buildChatRequest([
          {
            role: 'system',

            content: `
You are an AI shopping assistant.

Your job is to help users find products from our product database.

IMPORTANT RULES:

1. Never invent products.
2. Never invent product prices or specifications.
3. Always use the provided tools when the user asks about products.
4. Use search_products when the user is looking for products.
5. Use get_product_details when the user asks about a specific product.
6. Use compare_products when the user wants to compare products.
7. Only recommend products returned by the tools.
8. If no products match the user's requirements, say so honestly.
9. Give clear and useful reasoning for your recommendations.
10. Be friendly and concise.
`
          },

          ...messages
        ])
      )

    const assistantMessage =
      response.choices[0]?.message

    if (!assistantMessage) {
      throw new Error(
        'No response received from Groq'
      )
    }

    console.log(
      'AI response:',
      JSON.stringify(
        assistantMessage,
        null,
        2
      )
    )

    // ========================================================
    // NO TOOL CALL
    // ========================================================

    if (
      !assistantMessage.tool_calls ||
      assistantMessage.tool_calls.length === 0
    ) {

      return {
        message:
          assistantMessage.content ?? '',

        products: []
      }
    }

    // ========================================================
    // TOOL CALL
    // ========================================================

    const toolResults: unknown[] = []

    for (
      const toolCall
      of assistantMessage.tool_calls
    ) {

      const toolName =
        toolCall.function.name

      const toolArgs =
        JSON.parse(
          toolCall.function.arguments
        ) as Record<string, unknown>

      console.log(
        'Tool name:',
        toolName
      )

      console.log(
        'Tool args:',
        toolArgs
      )

      const result =
        await runTool(
          toolName,
          toolArgs
        )

      toolResults.push(result)
    }

    // ========================================================
    // SECOND GROQ REQUEST
    // ========================================================

    const toolMessages = assistantMessage
      .tool_calls
      .map((toolCall, index) => ({
        role: 'tool' as const,

        tool_call_id: toolCall.id,

        content: JSON.stringify(
          toolResults[index]
        )
      }))

    const finalResponse =
      await groq.chat.completions.create(
        buildChatRequest([
          {
            role: 'system',

            content: `
You are an AI shopping assistant.

Use ONLY the product data returned by the tools.

Do not invent products, prices, ratings, specifications, or features.

Give the user a helpful recommendation based on their requirements.

If multiple products were returned, explain which ones are the best choices and why.

Keep the answer clear and concise.
`
          },

          ...messages,

          assistantMessage as any,

          ...toolMessages
        ])
      )

    const finalMessage =
      finalResponse
        .choices[0]
        ?.message
        ?.content ?? ''

    // ========================================================
    // EXTRACT PRODUCTS
    // ========================================================

    const products = toolResults
      .flatMap(result => {

        if (Array.isArray(result)) {
          return result
        }

        if (result && typeof result === 'object') {
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

  } catch (error) {

    console.error(
      'Chat/Groq error:',
      error
    )

    throw error
  }
}