import { Link, useLoaderData } from 'react-router-dom'
import type { Channel } from '@chappy/shared'
import { useAuthStore } from '../stores/authStore'
import { useMessages } from '../hooks/useMessages'
import MessageForm from '../components/MessageForm'

export default function ChatPage() {
    const channel = useLoaderData() as Channel
    const token = useAuthStore((state) => state.token)

    const isLoggedIn = Boolean(token)
    const canEnter = !channel.isLocked || isLoggedIn
    const channelId = channel.PK.replace(/^CHANNEL#/, '')

    const {
        messages,
        isLoading,
        error,
        isSending,
        handleSendMessage
    } = useMessages(channelId, canEnter, token)

    return (
        <main>
            <Link to="/channels">Back to channels</Link>

            <h1>{channel.name}</h1>
            <p>{channel.description}</p>

            {canEnter ? (
                <section>
                    <h2>Messages</h2>

                    {isLoading ? (
                        <p>Loading messages...</p>
                    ) : error && messages.length === 0 ? (
                        <p role="alert">{error}</p>
                    ) : messages.length === 0 ? (
                        <p>No messages yet</p>
                    ) : (
                        <ul>
                            {messages.map((message) => (
                                <li key={message.id}>
                                    <strong>{message.username}: </strong>
                                    {message.content}
                                </li>
                            ))}
                        </ul>
                    )}

                    {error && messages.length > 0 && (
                        <p role="alert">{error}</p>
                    )}

                    {isLoggedIn && (
                        <MessageForm
                            onSend={handleSendMessage}
                            isSending={isSending}
                        />
                    )}

                    {!isLoggedIn && (
                        <p>
                            <Link to="/">Log in</Link> to send messages.
                        </p>
                    )}
                </section>
            ) : (
                <section>
                    <h2>Locked channel</h2>
                    <p>You must log in to view messages in this channel.</p>
                    <Link to="/">Log in</Link>
                </section>
            )}
        </main>
    )
}