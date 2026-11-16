
import { Link, useLoaderData } from 'react-router-dom'
import type { Channel } from '@chappy/shared'
import { useAuthStore } from '../stores/authStore'
import { useMessages } from '../hooks/useMessages'
import MessageForm from '../components/MessageForm'
import MessageList from '../components/MessageList'

export default function ChatPage() {
    const channel = useLoaderData() as Channel
    const token = useAuthStore(state => state.token)
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
        <div className="chat-page">
            <header className="chat-header">
                <h1>{channel.name}</h1>

                {channel.description && (
                    <p>{channel.description}</p>
                )}
            </header>

            {canEnter ? (
                <div className="chat-content">
                    <div className="chat-messages">
                        {isLoading ? (
                            <p>Loading messages...</p>
                        ) : error && messages.length === 0 ? (
                            <p role="alert">{error}</p>
                        ) : messages.length === 0 ? (
                            <p>No messages yet</p>
                        ) : (
                            <MessageList messages={messages} />
                        )}

                        {error && messages.length > 0 && (
                            <p role="alert">{error}</p>
                        )}
                    </div>

                    <div className="chat-input">
                        {isLoggedIn ? (
                            <MessageForm
                                onSend={handleSendMessage}
                                isSending={isSending}
                            />
                        ) : (
                            <p>
                                <Link to="/">Log in</Link> to send messages.
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="chat-locked">
                    <h2>Locked channel</h2>
                    <p>You must log in to view messages in this channel.</p>
                    <Link to="/">Log in</Link>
                </div>
            )}
        </div>
    )
}
