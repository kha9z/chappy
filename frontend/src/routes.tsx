import { createBrowserRouter } from 'react-router-dom'
import { getChannel } from './services/channelService'
import LoginPage from './pages/LoginPage'
import ChannelsPage from './pages/ChannelsPage'
import ChatPage from './pages/ChatPage'
import ErrorPage from './pages/ErrorPage'
import ChatLayout from './layouts/ChatLayout'

const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage />,
        errorElement: <ErrorPage />
    },
    {
        path: '/channels',
        element: <ChatLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <ChannelsPage />,
            },
            {
                path: ':id',
                element: <ChatPage />,
                loader: ({ params }) => {
                    if (!params.id) {
                        throw new Response('Channel ID missing', {
                            status: 400
                        })
                    }

                    return getChannel(params.id)
                }
            }
        ]
    }
])

export { router }
