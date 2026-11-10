import { useEffect, useState } from 'react'
import { API_URL } from '../config/api'

type Channel = {
    PK: string
    SK: string
    name: string
    description: string
    isLocked: boolean
}

export default function ChannelsPage() {
    const [channels, setChannels] = useState<Channel[]>([])
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    
    const token = sessionStorage.getItem('chappy_token')
    const username = sessionStorage.getItem('chappy_username')
    
    useEffect(() => {
        async function fetchChannels() {
            try {
                const response = await fetch(`${API_URL}/api/channels`)
                
                if (!response.ok) {
                    throw new Error('Could not load channels')
                }
                
                const data: Channel[] = await response.json()
                setChannels(data)

            } catch (error) {
                setError('Failed to load channels')
                console.error(error)

            } finally {
                setIsLoading(false)
            }
        }

        fetchChannels()
    }, [])

    return (
        <main>
            <h1>Channels</h1>
            <p> {token ? `Logged in as ${username}` : 'Browsing as Guest'} </p>

            {isLoading && <p>Loading channels..</p>}
            {error && <p role="alert">{error}</p>}

            {channels
                .filter((channel) => token || !channel.isLocked)
                .map((channel) => (
                    <article key={channel.PK}>
                        <h2>{channel.name}</h2>
                        <p>{channel.description}</p>
                        <p>{channel.isLocked ? 'Locked' : 'Public'}</p>
                    </article>
                ))
                }
        </main>
    )
}