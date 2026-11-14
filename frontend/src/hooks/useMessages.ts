import { useEffect, useRef, useState } from 'react'
import type { Message } from '@chappy/shared'
import { getMessages, sendMessage } from '../services/messageService'

type MessageState = {
    channelId: string
    token: string | null
    messages: Message[]
    isLoading: boolean
    error: string | null
}

export function useMessages(
    channelId: string,
    canEnter: boolean,
    token: string | null
) {
    const [state, setState] = useState<MessageState>({
        channelId,
        token,
        messages: [],
        isLoading: canEnter,
        error: null
    })

    const [isSending, setIsSending] = useState(false)
    const sendingRef = useRef(false)
    const requestVersion = useRef(0)

    const isCurrentChannel =
        state.channelId === channelId &&
        state.token === token

    useEffect(() => {
        const version = ++requestVersion.current
        let cancelled = false

        setState({
            channelId,
            token,
            messages: [],
            isLoading: canEnter,
            error: null
        })

        if (!canEnter) {
            return
        }

        async function loadMessages() {
            try {
                const messages = await getMessages(channelId)

                if (!cancelled && version === requestVersion.current) {
                    setState({
                        channelId,
                        token,
                        messages,
                        isLoading: false,
                        error: null
                    })
                }
            } catch (error) {
                if (!cancelled && version === requestVersion.current) {
                    console.error('Could not load messages:', error)

                    setState({
                        channelId,
                        token,
                        messages: [],
                        isLoading: false,
                        error: 'Could not load messages'
                    })
                }
            }
        }

        void loadMessages()

        return () => {
            cancelled = true
        }
    }, [channelId, canEnter, token])

    useEffect(() => {
        if (!canEnter) {
            return
        }

        let cancelled = false
        let isRefreshing = false

        async function refreshMessages() {
            if (isRefreshing || sendingRef.current) {
                return
            }

            isRefreshing = true

            try {
                const messages = await getMessages(channelId)

                if (!cancelled) {
                    setState((previous) => {
                        if (
                            previous.channelId !== channelId ||
                            previous.token !== token ||
                            sendingRef.current
                        ) {
                            return previous
                        }
                        return { ...previous, messages }
                    })
                }
            } catch (error) {
                console.error('Could not refresh messages:', error)
            } finally {
                isRefreshing = false
            }
        }

        const interval = setInterval(() => {
            void refreshMessages()
        }, 3000)

        return () => {
            cancelled = true
            clearInterval(interval)
        }
    }, [channelId, canEnter, token])

    async function handleSendMessage(content: string) {
        if (
            !canEnter ||
            !token ||
            !isCurrentChannel ||
            state.isLoading ||
            sendingRef.current ||
            !content.trim()
        ) {
            return false
        }

        sendingRef.current = true
        setIsSending(true)

        const version = requestVersion.current

        try {
            const newMessage = await sendMessage(channelId, content)

            if (version === requestVersion.current) {
                setState((previous) => ({
                    ...previous,
                    messages: [...previous.messages, newMessage],
                    error: null
                }))
            }

            return true
        } catch (error) {
            console.error('Could not send message:', error)

            if (version === requestVersion.current) {
                setState((previous) => ({
                    ...previous,
                    error: 'Could not send message'
                }))
            }

            return false
        } finally {
            sendingRef.current = false
            setIsSending(false)
        }
    }

    return {
        messages: canEnter && isCurrentChannel ? state.messages : [],
        isLoading: canEnter && (!isCurrentChannel || state.isLoading),
        error: canEnter && isCurrentChannel ? state.error : null,
        isSending,
        handleSendMessage
    }
}
