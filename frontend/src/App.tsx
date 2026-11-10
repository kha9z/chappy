import { HashRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ChannelsPage from './pages/ChannelsPage'

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/channels" element={<ChannelsPage />} />
            </Routes>
        </HashRouter>
    )
}

export default App