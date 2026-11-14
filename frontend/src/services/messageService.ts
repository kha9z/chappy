import { z } from 'zod'
import { messageSchema } from '@chappy/shared'
import { API_URL } from '../config/api'
import { useAuthStore } from '../stores/authStore'

export async function getMessages(channelId: string) {
    const token = useAuthStore.getState().token
    
    const response = await fetch(
        `${API_URL}/api/channels/${encodeURIComponent(channelId)}/messages`,
        {
            headers: token
            ? { Authorization: `Bearer ${token}`}
            : {}
        }
    )
    if (!response.ok) {
        throw new Error(`Could not load messages (HTTP ${response.status})`)
    }

    const data: unknown = await response.json()
    return z.array(messageSchema).parse(data)
}

export async function sendMessage(channelId: string, content: string) {
    const token = useAuthStore.getState().token

    if (!token) {
        throw new Error('You must be logged in to send messages')
    }

    const response = await fetch(
        `${API_URL}/api/channels/${encodeURIComponent(channelId)}/messages`,
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        }
    )
    if (!response.ok) {
        throw new Error(`Could not send message (HTTP ${response.status})`)
    }

    const data: unknown = await response.json()
    return messageSchema.parse(data)
}