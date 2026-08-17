import Groq from 'groq-sdk'
import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.GROQ_API_KEY

if (!apiKey) {
  throw new Error('GROQ_API_KEY is missing')
}

const groq = new Groq({
  apiKey
})

export async function listModels() {
  const models = await groq.models.list()

  return models.data.map(model => ({
    id: model.id,
    active: model.active,
    context_window: model.context_window
  }))
}

export async function testGroq() {
  try {
    const response = await groq.chat.completions.create({
      model:'openai/gpt-oss-120b',
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
console.log(
  'Groq key loaded:',
  process.env.GROQ_API_KEY
    ? `${process.env.GROQ_API_KEY.slice(0, 7)}...`
    : 'NO KEY'
)