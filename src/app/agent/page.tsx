'use client'

import { useChat } from 'ai/react'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat({
    api: 'api/agent',
    maxToolRoundtrips: 0,
  })
  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1>Agent</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 text-black shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  )
}
