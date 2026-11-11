import { API_URL } from '../config/api'
import { loginResponseSchema } from '@chappy/shared'

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

    localStorage.setItem(`chappy_token`, data.token)
    localStorage.setItem(`chappy_username`, data.user.username)

    return data.user
}

export function logout() {
    localStorage.removeItem('chappy_token')
    localStorage.removeItem('chappy_username')
}

export function getToken() {
    return localStorage.getItem('chappy_token')
}

export function getUserName() {
    return localStorage.getItem('chappy_username')
}