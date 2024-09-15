'use client'

import { type CoreMessage } from 'ai'
import { useState } from 'react'
import { continueConversation } from './actions'
import { readStreamableValue } from 'ai/rsc'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([])
  const [input, setInput] = useState('')

  // continueConversation([...messages, { content: 'hello', role: 'user' }])

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map((m, i) => (
        <div key={i} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          <div>data: {JSON.stringify(m, null, 2)}</div>
          {/* {m.content as string} */}
        </div>
      ))}

      <button
        onClick={async () => {
          const newMessages: CoreMessage[] = [
            ...messages,
            // { content: 'hello', role: 'user' },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'what is this image about?' },
                {
                  type: 'image',
                  image:
                    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmemes.co.in%2Fmemes%2Fupdate%2Fuploads%2F2021%2F04%2F60973c5-1103x1200.png&f=1&nofb=1&ipt=ae6980f9dca81a65c6cfafafc6417cc0efc36439820c5a2d5cd540f188330810&ipo=images',
                },
              ],
            },
          ]

          const result = await continueConversation(newMessages)

          for await (const content of readStreamableValue(result)) {
            console.log({ content })
            setMessages([
              ...newMessages,
              {
                role: 'assistant',
                content: content as string,
              },
            ])
          }
        }}
      >
        Coba
      </button>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const newMessages: CoreMessage[] = [
            ...messages,
            { content: input, role: 'user' },
          ]

          setMessages(newMessages)
          setInput('')

          const result = await continueConversation(newMessages)
          console.log({ result })

          for await (const content of readStreamableValue(result)) {
            console.log({ content })
            setMessages([
              ...newMessages,
              {
                role: 'assistant',
                content: content as string,
              },
            ])
          }
        }}
      >
        <input
          className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 text-black shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  )
}
