import { API_URL } from '../config/api'
import { channelSchema } from '@chappy/shared'
import { z } from 'zod'

export async function getChannels() {
    const response = await fetch(`${API_URL}/api/channels`)

    if (!response.ok) {
        throw new Error('Could not load channels (HTTP ${response.status})')
    }

    const data: unknown = await response.json()
    return z.array(channelSchema).parse(data)
}

export async function getChannel(id: string) {
    const response = await fetch(`${API_URL}/api/channels/${encodeURIComponent(id)}`)

    if (!response.ok) {
        throw new Error(`Could not load channel (HTTP ${response.status})`)
    }
    const data: unknown = await response.json
    return channelSchema.parse(data)
}