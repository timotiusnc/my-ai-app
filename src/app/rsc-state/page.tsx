'use client'

import { useState } from 'react'
import { AI, ClientMessage } from './actions'
import { useActions, useUIState } from 'ai/rsc'
import { generateId } from 'ai'

export default function RSCState() {
  const [input, setInput] = useState<string>('')
  const [conversation, setConversation] = useUIState<typeof AI>()
  const { continueConversation } = useActions()

  return (
    <div>
      <div>
        {conversation.map((message: ClientMessage) => (
          <div key={message.id}>
            <div>
              {message.role}: {message.display}
            </div>
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="text-black"
        />
        <button
          onClick={async () => {
            const id = generateId()
            setConversation((currentConversation: ClientMessage[]) => [
              ...currentConversation,
              { id, role: 'user', display: input },
            ])

            const message = await continueConversation(input, id)
            console.log('message', message)

            setConversation((currentConversation: ClientMessage[]) => [
              ...currentConversation,
              message,
            ])
          }}
        >
          Send Message
        </button>
      </div>
    </div>
  )
}
