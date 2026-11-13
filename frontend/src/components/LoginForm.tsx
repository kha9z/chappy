import { useLogin } from '../hooks/useLogin'

export default function LoginForm() {
    const {
        username,
        setUsername,
        password,
        setPassword,
        error,
        isLoading,
        handleLogin,
        handleGuestLogin
    } = useLogin()

    return (
        <>
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
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div className="guest-section">
                <button
                    type="button"
                    className="guest-button"
                    onClick={handleGuestLogin}
                >
                    Continue as Guest
                </button>
            </div>
        </>
    )
}