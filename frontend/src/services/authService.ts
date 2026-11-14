import { API_URL } from '../config/api'
import { loginResponseSchema } from '@chappy/shared'
import { useAuthStore } from '../stores/authStore'

export async function login(username: string, password: string) {
    const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
            username,
            password
        })
    })
    if (!response.ok) {
    throw new Error(`Invalid username or password`)
}
    const json: unknown = await response.json()
    const data = loginResponseSchema.parse(json)

    useAuthStore.getState().setAuth(data.token, data.user.username)
    return data.user
}

export function logout() {
    useAuthStore.getState().clearAuth()
}