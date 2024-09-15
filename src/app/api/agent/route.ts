import { openai } from '@ai-sdk/openai'
import { streamText, tool } from 'ai'
import * as mathjs from 'mathjs'
import { z } from 'zod'

const problem =
  'A taxi driver earns $9461 per 1-hour of work. ' +
  'If he works 12 hours a day and in 1 hour ' +
  'he uses 12 liters of petrol with a price  of $134 for 1 liter. ' +
  'How much money does he earn in one day?'

console.log(`PROBLEM: ${problem}`)

export async function POST() {
  // const { messages }: { messages: Message[] } = await req.json()

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system:
      'You are solving math problems. ' +
      'Reason step by step. ' +
      'Use the calculator when necessary. ' +
      'When you give the final answer, ' +
      'provide an explanation for how you arrived at it.',
    prompt: problem,
    tools: {
      calculate: tool({
        description:
          'A tool for evaluating mathematical expressions. ' +
          'Example expressions: ' +
          "'1.2 * (2 + 4.5)', '12.7 cm to inch', 'sin(45 deg) ^ 2'.",
        parameters: z.object({ expression: z.string() }),
        execute: async ({ expression }) => mathjs.evaluate(expression),
      }),
    },
    maxToolRoundtrips: 1,
  })
  // console.log(`ANSWER: ${answer}`)

  // result.roundtrips.flatMap((roundtrip) =>
  //   console.log({ toolCalls: JSON.stringify(roundtrip.toolCalls, null, 2) }),
  // )
  // result.roundtrips.flatMap((roundtrip) =>
  //   console.log({
  //     toolResults: JSON.stringify(roundtrip.toolResults, null, 2),
  //   }),
  // )
  return Response.json({ result: result.text })
}
