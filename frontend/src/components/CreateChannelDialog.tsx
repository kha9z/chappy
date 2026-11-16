import { useState } from 'react'
import type { FormEvent } from 'react'
import { createChannel } from '../services/channelService'
import './CreateChannelDialog.css'

type CreateChannelDialogProps = {
    onClose: () => void
    onCreated: (channelId: string) => void
}

export default function CreateChannelDialog({
    onClose,
    onCreated
}: CreateChannelDialogProps) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isLocked, setIsLocked] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (isLoading) {
            return
        }

        setError('')
        setIsLoading(true)

        try {
            const channel = await createChannel(
                name,
                description,
                isLocked
            )

            const channelId = channel.PK.replace(/^CHANNEL#/, '')

            onCreated(channelId)
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Could not create channel'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="create-channel-dialog" role="dialog" aria-modal="true" aria-labelledby="create-channel-title">
            <div className="dialog-titlebar">
                <h2 id="create-channel-title">Create channel</h2>
                <button type="button" onClick={onClose} disabled={isLoading} aria-label="Close">
                    x
                </button>
            </div>

            <form onSubmit={handleSubmit} className="create-channel-form">
                <label htmlFor="channel-name">Channel name</label>
                <input
                    id="channel-name"
                    type="text"
                    value={name}
                    onChange={event => setName(event.target.value)}
                    maxLength={50}
                    required
                />

                <label htmlFor="channel-description">Description</label>
                <input
                    id="channel-description"
                    type="text"
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                />

                <fieldset>
                    <legend>Channel access</legend>

                    <label>
                        <input
                            type="radio"
                            name="channel-access"
                            checked={!isLocked}
                            onChange={() => setIsLocked(false)}
                        />
                        Public
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="channel-access"
                            checked={isLocked}
                            onChange={() => setIsLocked(true)}
                        />
                        Locked
                    </label>
                </fieldset>

                {error && <p role="alert">{error}</p>}

                <div className="dialog-actions">
                    <button type="button" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </button>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    )
}
