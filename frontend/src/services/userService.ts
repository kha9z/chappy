import { z } from 'zod'
import { API_URL } from '../config/api'

export const publicUserSchema = z.object({
    id: z.string().uuid(),
    username: z.string()
})

export type PublicUser = z.infer<typeof publicUserSchema>

export async function getUsers(): Promise<PublicUser[]> {
    const response = await fetch(`${API_URL}/api/users`)

    if (!response.ok) {
        throw new Error(`Could not load users (HTTP ${response.status})`)
    }

    const data: unknown = await response.json()

    return z.array(publicUserSchema).parse(data)
}
