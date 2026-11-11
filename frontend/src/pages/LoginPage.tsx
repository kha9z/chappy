import chappyLoginImg from '../assets/chappylogin.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, logout } from '../services/authService'
import './LoginPage.css'


export default function LoginPage() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

async function handleLogin(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
        await login(username, password)
        navigate('/channels', { replace: true })

    } catch (error) {
        setError('Login failed. Check your username or password.')
        console.error(error)

    } finally {
        setIsLoading(false)
    }
}

    function handleGuestLogin() {
        logout()
        navigate('/channels')
    }

    return (
        <main className="login-page">
            <section className="login-art">
                <img
                    src={chappyLoginImg}
                    alt="chappy chat room"
                />
            </section>

            <section className="login-panel">
                <div className="login-window">
                    <div className="window-titlebar">
                        <span>Chappy - Login</span>
                    </div>

                    <div className="window-content">
                        <h1>Welcome to Chappy!</h1>
                        <p>Sign in to start chatting.</p>

                        <form className="login-form" onSubmit={handleLogin}>
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                required
                            />

                            <label htmlFor="password">Password</label>
                            <input 
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />

                            {error && (
                                <p className="login-error" role="alert">
                                    {error}
                                </p>
                            )}

                            <button type="submit" disabled={isLoading}>
                                {isLoading ? 'Logging in..' : 'Login'}
                            </button>
                        </form>

                        <div className="guest-section">
                            <button
                                type="button"
                                className="guest-button"
                                onClick={handleGuestLogin}
                                >Continue as Guest
                            </button>
                        </div>

                        <p className="signup-text">
                            Don't have an account? Sign up
                        </p>
                    </div>
                </div>
            </section>
        </main>

    )
}