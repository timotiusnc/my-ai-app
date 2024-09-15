import { openai } from '@ai-sdk/openai'
import { convertToCoreMessages, streamText, tool, ToolInvocation } from 'ai'
import { z } from 'zod'

// Allow streaming responses up to 30 seconds
export const maxDuration = 1

interface Message {
  role: 'user' | 'assistant'
  content: string
  toolInvocations?: ToolInvocation[]
}

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
  const { messages }: { messages: Message[] } = await req.json()
  // const data = new StreamData()
  // data.append({ test: 'value' })

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: convertToCoreMessages(messages),
    // experimental_toolCallStreaming: true,
    tools: {
      weather: tool({
        description: 'Get the weather in a location',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          console.log('tool calling')
          return {
            location,
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
          }
        },
        // execute: async ({ location }) => {
        //   const temperature = 72 + Math.floor(Math.random() * 21) - 10
        //   return `${temperature}°fahrenheit nang ${location}!`
        // },
      }),
    },
    maxSteps: 2,
    // onFinish() {
    //   data.close()
    // },
  })

  // for await (const textPart of result.textStream) {
  //   console.log({ textPart })
  // }
  // console.log({ result: result.responseMessages })
  // return Response.json({ text: result.text })
  return result.toDataStreamResponse()
}
