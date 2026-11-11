import { useLoaderData } from 'react-router-dom'
import type { Channel } from '@chappy/shared'
import { getToken, getUserName } from '../services/authService'
import ChannelList from '../components/ChannelList'

export default function ChannelsPage() {
    const channels = useLoaderData() as Channel[]

    const token = getToken()
    const username = getUserName()

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
