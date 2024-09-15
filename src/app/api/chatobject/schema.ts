import { z } from 'zod'

// define a schema for the notifications
export const notificationSchema = z.object({
  notifications: z.array(
    z.object({
      name: z.string().describe('Food.'),
      message: z.string().describe('Song.'),
    }),
  ),
})
