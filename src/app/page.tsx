'use client'

import { useChat } from 'ai/react'

// Allow streaming responses up to 30 seconds
export const maxDuration = 1

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    data,
    reload,
    stop,
  } = useChat({
    onResponse(response) {
      console.log({ response })
    },
    onFinish(result) {
      console.log({ result })
    },
  })
  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
          {/* <div>data: {JSON.stringify(m, null, 2)}</div> */}
          <div>---</div>
        </div>
      ))}

      <button onClick={() => reload()}>Reload</button>
      <button onClick={() => stop()}>Stop</button>

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
