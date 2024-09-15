import { openai } from '@ai-sdk/openai'
import { streamObject } from 'ai'
import { notificationSchema } from './schema'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const context = await req.json()

  const result = await streamObject({
    model: openai('gpt-4o-mini'),
    schema: notificationSchema,
    // output: 'no-schema',
    prompt:
      // `Generate 3 notifications for a messages app in this context:` + context,
      `Generate 3:` + context,
  })

  for await (const partialObject of result.partialObjectStream) {
    console.log(JSON.stringify(partialObject, null, 2))
  }

  return result.toTextStreamResponse()
}
