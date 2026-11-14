import { createBrowserRouter } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ChannelsPage from './pages/ChannelsPage'
import ChatPage from './pages/ChatPage'
import ErrorPage from './pages/ErrorPage'
import { getChannels, getChannel } from './services/channelService'


const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage />,
        errorElement: <ErrorPage />
    },
    {
        path: '/channels',
        element: <ChannelsPage />,
        loader: getChannels,
        errorElement: <ErrorPage />
    },
    {
        path: '/channels/:id',
        element: <ChatPage />,
        loader: ({ params }) => {
            if (!params.id) {
                throw new Response('Channel ID missing', { status: 400 })
            }
            return getChannel(params.id)
        },
        errorElement: <ErrorPage />
    }
])

export { router }
