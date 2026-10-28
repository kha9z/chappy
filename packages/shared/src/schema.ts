import { z } from 'zod'

export const createChannelSchema = z.object({
    id: z.string().trim().min(1).regex(/^[a-zA-Z0-9_-]+$/),
    name: z.string().trim().min(1),
    description: z.string(),
    isLocked: z.boolean()
})

export type CreateChannel = z.infer<typeof createChannelSchema>