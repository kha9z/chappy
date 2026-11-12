import { create } from 'zustand'

type AuthState = {
    token: string | null
    username: string | null
    setAuth: (token: string, username: string) => void
    clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('chappy_token'),
    username: localStorage.getItem('chappy_username'),

    setAuth: (token, username) => {
        localStorage.setItem('chappy_token', token)
        localStorage.setItem('chappy_username', username)

        set({ token, username })
    },

    clearAuth: () => {
        localStorage.removeItem('chappy_token')
        localStorage.removeItem('chappy_username')

        set({ token: null, username: null })
    }
}))
