import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

type AuthTokenPayload = {
    id: string
    username: string
}

function verifyToken(token: string): AuthTokenPayload {
    const jwtSecret = process.env.JWT_SECRET

    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not configured')
    }

    const decoded = jwt.verify(token, jwtSecret)

    if (
        typeof decoded === 'string' ||
        typeof decoded.sub !== 'string' ||
        typeof decoded.username !== 'string'
    ) {
        throw new Error('Invalid token payload')
    }

    return {
        id: decoded.sub,
        username: decoded.username
    }
}

export const checkAuthMiddleware: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        next()
        return
    }

    if (!authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            error: 'Invalid authorization header'
        })
        return
    }

    try {
        res.locals.user = verifyToken(authHeader.slice(7))
        next()
    } catch (error) {
        if (error instanceof Error && error.message === 'JWT_SECRET is not configured') {
            res.status(500).json({
                error: 'Server configuration error'
            })
            return
        }

        res.status(401).json({
            error: 'Invalid or expired token'
        })
    }
}

export const authMiddleware: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({
            error: 'Missing or invalid authorization header'
        })
        return
    }

    try {
        res.locals.user = verifyToken(authHeader.slice(7))
        next()
    } catch (error) {
        if (error instanceof Error && error.message === 'JWT_SECRET is not configured') {
            res.status(500).json({
                error: 'Server configuration error'
            })
            return
        }

        res.status(401).json({
            error: 'Invalid or expired token'
        })
    }
}