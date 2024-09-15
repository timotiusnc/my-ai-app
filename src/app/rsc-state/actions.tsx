import { openai } from '@ai-sdk/openai'
import { generateId } from 'ai'
import { createAI, getAIState, getMutableAIState, streamUI } from 'ai/rsc'
import { ReactNode } from 'react'

type MessageRoles = 'user' | 'assistant' | 'system'

export interface ServerMessage {
  id: string
  role: MessageRoles
  content: string
}

export interface ClientMessage {
  id: string
  role: MessageRoles
  display: ReactNode
}

export async function continueConversation(
  input: string,
  id: string,
): Promise<ClientMessage> {
  'use server'
  const history = getMutableAIState<typeof AI>()
  const serverId = generateId()

  try {
    const result = await streamUI({
      model: openai('gpt-4o-mini'),
      messages: [
        ...history.get(),
        { role: 'user', content: [{ type: 'text', text: input }] },
      ],
      text: ({ content, done }) => {
        if (done) {
          history.done([
            ...history.get(),
            { id, role: 'user', content: input },
            { role: 'assistant', content, id: serverId },
          ])
        }

        return <div>{content}</div>
      },
    })

    return {
      id: serverId,
      role: 'assistant',
      display: result.value,
    }
  } catch (error) {
    console.error({ error })
    return {
      id: serverId,
      role: 'system',
      display: <div>Error cok</div>,
    }
  }
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  onSetAIState: async ({ state, done, key }) => {
    'use server'
    console.log('onSetAIState', { state, done, key })
  },
  onGetUIState: async () => {
    'use server'

    const history: ServerMessage[] = getAIState() as ServerMessage[]
    console.log('getAIState', { history })
    return history.map((message) => ({
      id: message.id,
      role: message.role,
      display: message.content,
    }))
  },
  initialAIState: [],
  initialUIState: [],
})
