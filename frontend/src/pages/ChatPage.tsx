import { Link, useLoaderData } from 'react-router-dom'
import type { Channel } from '@chappy/shared'
import { getToken } from '../services/authService'

export default function ChatPage() {
    const channel = useLoaderData() as Channel
    const isLoggedIn = Boolean(getToken())
    const canEnter = !channel.isLocked || isLoggedIn

    return ( 
        <main>
            <Link to="/channels">Back to channels</Link>

            <h1>{channel.name}</h1>
            <p>{channel.description}</p>
        
            {canEnter ? (
                <section>
                    <h2>Messages</h2>
                    <p>No messages</p>
                </section>
            ) : (
                <section>
                    <h2>Locked channels</h2>
                    <p>You most log in to view messages in this channel.</p>
                    <Link to="/">Log in</Link>
                </section>
            )}
        </main>
    )
}