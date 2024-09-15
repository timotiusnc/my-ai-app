'use server'

import { streamUI } from 'ai/rsc'
import { openai } from '@ai-sdk/openai'
import { convertToCoreMessages } from 'ai'
import { z } from 'zod'

export async function streamComponent(input: string) {
  const ui = await streamUI({
    model: openai('gpt-4o-mini'),
    // prompt: input,
    messages: convertToCoreMessages([{ content: input, role: 'user' }]),
    text: async ({ content }) => {
      return <div className="text-red-500">asu{content}</div>
    },
    tools: {
      getWeather: {
        description: 'Get the weather for a location',
        parameters: z.object({ location: z.string() }),
        generate: async function* ({ location }) {
          yield <LoadingComponent />
          await new Promise((resolve) => setTimeout(resolve, 5000))
          const weather = 'Sunny'
          return <WeatherComponent weather={weather} location={location} />
        },
      },
    },
  })

  return ui.value
}

function LoadingComponent() {
  return <div>Loading...</div>
}

function WeatherComponent({
  weather,
  location,
}: {
  weather: string
  location: string
}) {
  return (
    <div>
      Weather in {location}: {weather}
    </div>
  )
}
