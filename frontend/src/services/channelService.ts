
import { API_URL } from '../config/api'
import { channelSchema, createChannelSchema } from '@chappy/shared'
import { useAuthStore } from '../stores/authStore'
import { z } from 'zod'

export async function getChannels() {
    const response = await fetch(`${API_URL}/api/channels`)

    if (!response.ok) {
        throw new Error(`Could not load channels (HTTP ${response.status})`)
    }

    const data: unknown = await response.json()
    return z.array(channelSchema).parse(data)
}

export async function getChannel(id: string) {
    const response = await fetch(
        `${API_URL}/api/channels/${encodeURIComponent(id)}`
    )

    if (!response.ok) {
        throw new Error(`Could not load channel (HTTP ${response.status})`)
    }

    const data: unknown = await response.json()
    return channelSchema.parse(data)
}

export async function createChannel(
    name: string,
    description: string,
    isLocked: boolean
) {
    const token = useAuthStore.getState().token

    if (!token) {
        throw new Error('You must be logged in to create a channel')
    }

    const id = name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')

    const channelData = createChannelSchema.parse({
        id,
        name: name.trim(),
        description,
        isLocked
    })

    const response = await fetch(`${API_URL}/api/channels`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(channelData)
    })

    if (response.status === 409) {
        throw new Error('A channel with that name already exists')
    }

    if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.')
    }

    if (!response.ok) {
        throw new Error(`Could not create channel (HTTP ${response.status})`)
    }

    const data: unknown = await response.json()
    return channelSchema.parse(data)
}
