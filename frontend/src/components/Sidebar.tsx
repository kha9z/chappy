import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import type { Channel } from '@chappy/shared'
import { getChannels } from '../services/channelService'

type SidebarProps = {
    refreshKey: number
}

export default function Sidebar({ refreshKey }: SidebarProps) {
    const [channels, setChannels] = useState<Channel[]>([])
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isActive = true

        async function loadChannels() {
            setIsLoading(true)
            setError('')

            try {
                const data = await getChannels()

                if (isActive) {
                    setChannels(data)
                }
            } catch {
                if (isActive) {
                    setError('Could not load channels')
                }
            } finally {
                if (isActive) {
                    setIsLoading(false)
                }
            }
        }

        void loadChannels()

        return () => {
            isActive = false
        }
    }, [refreshKey])

    return (
        <aside className="chappy-sidebar">
            <div className="sidebar-network">
                Chappy network
            </div>

            <div className="sidebar-group">
                <div className="sidebar-group-title">
                    Channels
                </div>

                <nav aria-label="Channels">
                    {channels.map(channel => {
                        const channelId = channel.PK.replace(/^CHANNEL#/, '')

                        return (
                            <NavLink
                                key={channel.PK}
                                to={`/channels/${channelId}`}
                                className={({ isActive }) =>
                                    isActive
                                        ? 'sidebar-channel active'
                                        : 'sidebar-channel'
                                }
                            >
                                <span aria-hidden="true">
                                    {channel.isLocked ? '🔒' : '#'}
                                </span>

                                <span>{channel.name}</span>
                            </NavLink>
                        )
                    })}
                </nav>

                {isLoading && <p>Loading channels...</p>}

                {error && <p role="alert">{error}</p>}

                {!isLoading && !error && channels.length === 0 && (
                    <p>No channels available</p>
                )}
            </div>

            <div className="sidebar-group">
                <div className="sidebar-group-title">
                    Private Messages
                </div>
            </div>
        </aside>
    )
}
