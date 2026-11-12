import { useLoaderData } from 'react-router-dom'
import type { Channel } from '@chappy/shared'
import { useAuthStore } from '../stores/authStore'
import ChannelList from '../components/ChannelList'

export default function ChannelsPage() {
    const channels = useLoaderData() as Channel[]

    const token = useAuthStore((state) => state.token)
    const username = useAuthStore((state) => state.username)

    return (
        <main>
            <h1>Channels</h1>

            <p>
                {token ? `Logged in as ${username}` : 'Browsing as Guest'}
            </p>

            <ChannelList channels={channels} />
        </main>
    )
}
