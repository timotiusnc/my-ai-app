import { openai } from '@ai-sdk/openai'
import { convertToCoreMessages, StreamData, streamText } from 'ai'

/**
 * Handles POST requests for chat functionality.
 *
 * This function processes incoming chat messages, streams them to the OpenAI API,
 * and returns the response as a data stream.
 *
 * @param req - The incoming HTTP request object.
 * @returns A Promise that resolves to a Response object containing the streamed data.
 */
export async function POST(req: Request) {
  const { messages } = await req.json()
  const data = new StreamData()
  data.append({ test: 'value' })

  console.log({ messages })
  console.log({ core: convertToCoreMessages(messages) })

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: convertToCoreMessages(messages),
    abortSignal: req.signal,
    onFinish(result) {
      console.log({ result })
      // data.append(JSON.parse(JSON.stringify(result, null, 2)))
      data.close()
    },
  })

  return result.toDataStreamResponse({ data })
}
