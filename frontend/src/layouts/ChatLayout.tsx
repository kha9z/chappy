import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import Sidebar from '../components/Sidebar'
import CreateChannelDialog from '../components/CreateChannelDialog'
import UserList from '../components/UserList'
import './ChatLayout.css'

export default function ChatLayout() {
    const navigate = useNavigate()
    const token = useAuthStore(state => state.token)
    const [showCreateChannel, setShowCreateChannel] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    function handleChannelCreated(channelId: string) {
        setShowCreateChannel(false)
        setRefreshKey(previous => previous + 1)
        navigate(`/channels/${channelId}`)
    }

    return (
        <div className="chappy-app">
            <header className="chappy-titlebar">
                <span>Chappy</span>
            </header>

            <nav className="chappy-toolbar">
                <button type="button">Connect</button>
                <button type="button">Disconnect</button>
                <button type="button" onClick={() => navigate('/channels')}>
                    Channel List
                </button>
                <button
                    type="button"
                    onClick={() => setShowCreateChannel(true)}
                    disabled={!token}
                >
                    Create Channel
                </button>
                <button type="button">Messages</button>
            </nav>

            <div className="chappy-workspace">
                <Sidebar refreshKey={refreshKey} />

                <section className="chappy-main">
                    <Outlet />

                    {showCreateChannel && (
                        <CreateChannelDialog
                            onClose={() => setShowCreateChannel(false)}
                            onCreated={handleChannelCreated}
                        />
                    )}
                </section>

                <UserList />

            </div>
        </div>
    )
}
