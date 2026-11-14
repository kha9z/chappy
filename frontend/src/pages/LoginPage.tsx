import chappyLoginImg from '../assets/chappylogin.png'
import LoginForm from '../components/LoginForm'
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

                        <LoginForm />

                        <p className="signup-text">
                            Don't have an account? Sign up
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}