
import { useEffect, useRef } from 'react'
import type { Message } from '@chappy/shared'

type MessageListProps = {
    messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
    const listRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
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
        if (!lastMessageId) {
            previousLastId.current = null
            return
        }

        if (previousLastId.current !== lastMessageId) {
            if (shouldAutoScroll.current) {
                bottomRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
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
            style={{
                height: '400px',
                overflowY: 'auto'
            }}
        >
            <ul>
                {messages.map((message) => (
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

            <div ref={bottomRef} />
        </div>
    )
}
