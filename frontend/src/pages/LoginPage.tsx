import chappyLoginImg from '../assets/chappylogin.png'
import './LoginPage.css'

export default function LoginPage() {
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

                        <form className="login-form">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Username"
                            />

                            <label htmlFor="password">Password</label>
                            <input 
                                id="password"
                                type="password"
                                placeholder="Password"
                            />

                            <button type="submit">
                                Login
                            </button>
                        </form>

                        <div className="guest-section">
                            <button
                                type="button"
                                className="guest-button"
                                >Continue as Guest</button>
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