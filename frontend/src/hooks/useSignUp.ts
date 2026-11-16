import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { register } from '../services/authService'

export function useSignUp(onSuccess: () => void) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handleSignUp(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        if (isLoading) {
            return
        }

        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsLoading(true)

        try {
            await register(username, password)
            onSuccess()
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Registration failed'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return {
        username,
        setUsername,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        isLoading,
        handleSignUp
    }
}
