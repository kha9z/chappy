
import { useState } from 'react'
import type { FormEvent } from 'react'
import './MessageForm.css'

type MessageFormProps = {
    onSend: (content: string) => Promise<boolean>
    isSending: boolean
}

export default function MessageForm({
    onSend,
    isSending
}: MessageFormProps) {
    const [content, setContent] = useState('')

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!content.trim() || isSending) {
            return
        }

        const success = await onSend(content)

        if (success) {
            setContent('')
        }
    }

    return (
        <form className="message-form" onSubmit={handleSubmit}>
            <label htmlFor="message" className="message-label">
                Your message
            </label>

            <input
                id="message"
                type="text"
                placeholder="Write a message..."
                value={content}
                onChange={event => setContent(event.target.value)}
                maxLength={2000}
                disabled={isSending}
                required
            />

            <button
                type="submit"
                disabled={isSending || !content.trim()}
            >
                {isSending ? 'Sending...' : 'Send'}
            </button>
        </form>
    )
}
