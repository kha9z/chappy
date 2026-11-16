
import { useSignUp } from '../hooks/useSignUp'

type SignUpFormProps = {
    onSuccess: () => void
}

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
    const {
        username,
        setUsername,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        isLoading,
        handleSignUp
    } = useSignUp(onSuccess)

    return (
        <form className="login-form" onSubmit={handleSignUp}>
            <label htmlFor="signup-username">Username</label>
            <input
                id="signup-username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                minLength={3}
                maxLength={18}
                pattern="[a-zA-Z0-9_]+"
                autoComplete="username"
                disabled={isLoading}
                required
            />

            <label htmlFor="signup-password">Password</label>
            <input
                id="signup-password"
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={5}
                maxLength={128}
                autoComplete="new-password"
                disabled={isLoading}
                required
            />

            <label htmlFor="signup-confirm">Confirm password</label>
            <input
                id="signup-confirm"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={5}
                maxLength={128}
                autoComplete="new-password"
                disabled={isLoading}
                required
            />

            {error && (
                <p className="login-error" role="alert">
                    {error}
                </p>
            )}

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create account'}
            </button>
        </form>
    )
}
