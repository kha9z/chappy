import { useEffect, useState } from 'react'
import { getUsers } from '../services/userService'
import type { PublicUser } from '../services/userService'

export default function UserList() {
    const [users, setUsers] = useState<PublicUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let isActive = true

        async function loadUsers() {
            try {
                const data = await getUsers()

                if (isActive) {
                    setUsers(data)
                }
            } catch {
                if (isActive) {
                    setError('Could not load users')
                }
            } finally {
                if (isActive) {
                    setIsLoading(false)
                }
            }
        }

        void loadUsers()

        return () => {
            isActive = false
        }
    }, [])

    return (
        <aside className="chappy-users" aria-label="Registered users">
            <div className="users-header">
                Registered users ({users.length})
            </div>

            <div className="users-content">
                {isLoading && <p>Loading users...</p>}

                {error && <p role="alert">{error}</p>}

                {!isLoading && !error && users.length === 0 && (
                    <p>No registered users yet.</p>
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
