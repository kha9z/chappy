
import { useEffect, useRef } from 'react'
import type { Message } from '@chappy/shared'
import './MessageList.css'

type MessageListProps = {
    messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
    const listRef = useRef<HTMLDivElement>(null)
    const shouldAutoScroll = useRef(true)
    const previousLastId = useRef<string | null>(null)
    const lastMessageId = messages.at(-1)?.id ?? null

    function handleScroll() {
        const list = listRef.current

        if (!list) {
            return
        }

        const distanceFromBottom =
            list.scrollHeight - list.scrollTop - list.clientHeight

        shouldAutoScroll.current = distanceFromBottom < 100
    }

    useEffect(() => {
        const list = listRef.current

        if (!list || !lastMessageId) {
            previousLastId.current = lastMessageId
            return
        }

        if (previousLastId.current !== lastMessageId) {
            if (shouldAutoScroll.current) {
                list.scrollTo({
                    top: list.scrollHeight,
                    behavior: previousLastId.current ? 'smooth' : 'instant'
                })
            }

            previousLastId.current = lastMessageId
        }
    }, [lastMessageId])

    return (
        <div
            className="message-list"
            ref={listRef}
            onScroll={handleScroll}
        >
            <ul>
                {messages.map(message => (
                    <li key={message.id}>
                        <strong>{message.username}</strong>

                        <time dateTime={message.createdAt}>
                            {' '}
                            {new Date(message.createdAt).toLocaleTimeString(
                                undefined,
                                {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }
                            )}
                        </time>

                        <p>{message.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}
