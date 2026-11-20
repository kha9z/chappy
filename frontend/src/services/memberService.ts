import { z } from 'zod'
import { API_URL } from '../config/api'
import { useAuthStore } from '../stores/authStore'

const memberSchema = z.object({
    id: z.string().uuid(),
    username: z.string()
})

export type ChannelMember = z.infer<typeof memberSchema>

export async function getChannelMembers(
    channelId: string
): Promise<ChannelMember[]> {
    const response = await fetch(
        `${API_URL}/api/channels/${encodeURIComponent(channelId)}/members`
    )

    if (!response.ok) {
        throw new Error(`Could not load members (HTTP ${response.status})`)
    }

    const data: unknown = await response.json()

    return z.array(memberSchema).parse(data)
}

export async function joinChannel(channelId: string): Promise<void> {
    const token = useAuthStore.getState().token

    if (!token) {
        throw new Error('You must be logged in to join a channel')
    }

    const response = await fetch(
        `${API_URL}/api/channels/${encodeURIComponent(channelId)}/members`,
        {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        }
    )

    if (!response.ok) {
        throw new Error(`Could not join channel (HTTP ${response.status})`)
    }
}
