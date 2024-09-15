'use client'

import { experimental_useObject as useObject } from 'ai/react'
import { notificationSchema } from '../api/chatobject/schema'

export default function Page() {
  const { object, submit, isLoading, stop } = useObject({
    api: '/api/chatobject',
    schema: notificationSchema,
  })

  return (
    <div>
      <button
        onClick={() => submit('Messages during finals week.')}
        disabled={isLoading}
      >
        Generate notifications
      </button>

      {isLoading && (
        <div>
          <div>Loading...</div>
          <button type="button" onClick={() => stop()}>
            Stop
          </button>
        </div>
      )}

      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </div>
  )
}
