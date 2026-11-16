import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import SignUpForm from '../components/SignUpForm'
import chappyLoginImg from '../assets/chappylogin.png'
import './LoginPage.css'

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [registrationSuccess, setRegistrationSuccess] = useState(false)

    function handleSignUpSuccess() {
        setIsSignUp(false)
        setRegistrationSuccess(true)
    }

    function toggleForm() {
        setIsSignUp((previous) => !previous)
        setRegistrationSuccess(false)
    }

    return (
        <main className="login-page">
            <section className="login-art">
                <img
                    src={chappyLoginImg}
                    alt="Chappy chat room"
                />
            </section>

            <section className="login-panel">
                <div className="login-window">
                    <div className="window-titlebar">
                        <span>
                            {isSignUp
                                ? 'Chappy - Sign Up'
                                : 'Chappy - Login'}
                        </span>
                    </div>

                    <div className="window-content">
                        <h1>
                            {isSignUp
                                ? 'Create your account'
                                : 'Welcome to Chappy!'}
                        </h1>

                        <p>
                            {isSignUp
                                ? 'Join Chappy and start chatting.'
                                : 'Sign in to start chatting.'}
                        </p>

                        {registrationSuccess && (
                            <p role="status" className="success-message">
                                Account created! You can now log in.
                            </p>
                        )}

                        {isSignUp ? (
                            <SignUpForm
                                onSuccess={handleSignUpSuccess}
                            />
                        ) : (
                            <LoginForm />
                        )}

                        <p className="signup-text">
                            {isSignUp
                                ? 'Already have an account?'
                                : "Don't have an account?"}

                            {' '}

                            <button
                                type="button"
                                onClick={toggleForm}
                            >
                                {isSignUp ? 'Log in' : 'Sign up'}
                            </button>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}
