'use client'

import { useState } from 'react'
import { streamComponent } from './action'

export default function Page() {
  const [component, setComponent] = useState<React.ReactNode>()

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setComponent(
            await streamComponent(
              "what's the weather in atlanta and hawaii, or get the closing stock market price from yesterday and have Jeff Foxworthy make a joke about it.?",
            ),
          )
        }}
      >
        <button>Stream Component</button>
      </form>
      <div>{component}</div>
    </div>
  )
}
