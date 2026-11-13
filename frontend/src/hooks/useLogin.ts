import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, logout } from '../services/authService'

export function useLogin() {
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handleLogin(event: SubmitEvent<HTMLFormElement>) {
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

    return {
        username,
        setUsername,
        password,
        setPassword,
        error,
        isLoading,
        handleLogin,
        handleGuestLogin
    }
}