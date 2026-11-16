
import { useAuthStore } from '../stores/authStore'

export default function ChannelsPage() {
    const token = useAuthStore(state => state.token)
    const username = useAuthStore(state => state.username)

    return (
        <div className="channels-page">
            <div className="channels-welcome">
                <h1>Welcome to Chappy!</h1>

                <p>
                    {token
                        ? `Connected as ${username}`
                        : 'Browsing as Guest'}
                </p>

                <p>
                    Select a channel from the sidebar to start chatting.
                </p>
            </div>
        </div>
    )
}
