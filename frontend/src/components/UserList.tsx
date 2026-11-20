
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { getUsers } from '../services/userService'
import type { PublicUser } from '../services/userService'
import { getChannelMembers, joinChannel } from '../services/memberService'

export default function UserList() {
    const { id: channelId } = useParams<{ id: string }>()
    const token = useAuthStore(state => state.token)

    const [users, setUsers] = useState<PublicUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let isActive = true

        async function loadUsers() {
            setIsLoading(true)
            setError('')
            setUsers([])

            try {
                if (!channelId) {
                    const data = await getUsers()

                    if (isActive) {
                        setUsers(data)
                    }

                    return
                }

                if (token) {
                    await joinChannel(channelId)
                }

                const data = channelId === 'general'
                    ? await getUsers()
                    : await getChannelMembers(channelId)

                if (isActive) {
                    setUsers(data)
                }
            } catch (error) {
                if (isActive) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : 'Could not load users'
                    )
                }
            } finally {
                if (isActive) {
                    setIsLoading(false)
                }
            }
        }

        void loadUsers()

        return () => { isActive = false }
    }, [channelId, token])

    const isGeneral = !channelId || channelId === 'general'

    return (
        <aside className="chappy-users" aria-label="Channel users">
            <div className="users-header">
                {isGeneral ? 'Registered users' : 'Channel members'}
                {' '}({users.length})
            </div>

            <div className="users-content">
                {isLoading && <p>Loading users...</p>}

                {error && <p role="alert">{error}</p>}

                {!isLoading && !error && users.length === 0 && (
                    <p>
                        {isGeneral
                            ? 'No registered users yet.'
                            : 'No channel members yet.'}
                    </p>
                )}

                {!isLoading && !error && (
                    <ul className="users-list">
                        {users.map(user => (
                            <li key={user.id}>
                                <span className="user-name">
                                    {user.username}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </aside>
    )
}
