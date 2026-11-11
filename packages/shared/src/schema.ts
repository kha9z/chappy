import { z } from 'zod'

export const createChannelSchema = z.object({
    id: z.string().trim().min(1).regex(/^[a-zA-Z0-9_-]+$/),
    name: z.string().trim().min(1),
    description: z.string(),
    isLocked: z.boolean()
})                  
export type CreateChannel = z.infer<typeof createChannelSchema>

export const registerUserSchema = z.object({
    username: z.string()
        .trim()
        .min(3, 'Username must be atleast 3 characters')
        .max(18, 'Username cannot exceed 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Ivalid letters'),

    password: z.string()
        .min(5, 'Password must be atleast 5 characters')
        .max(128, 'Password is too long')
})                  

export const loginUserSchema = z.object({
    username: z.string().trim().min(1),
    password: z.string().min(1)
})

export const loginResponseSchema = z.object({
    message: z.string(),
    token: z.string().min(1),
    user: z.object({
        id: z.string().uuid(),
        username: z.string().min(1)
    })
})

export type LoginResponse = z.infer<typeof loginResponseSchema>
export type RegisterUser = z.infer<typeof registerUserSchema>
export type LoginUser = z.infer<typeof loginUserSchema>