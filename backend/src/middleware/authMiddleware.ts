import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

type AuthTokenPayload = {
    sub: string
    username: string
}

export const authMiddleware: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({
            error: 'Missing or invalid authorization header'
        })
        return
    }

    const token = authHeader.slice(7)
    const jwtSecret = process.env.JWT_SECRET
    if(!jwtSecret) {
        console.error('JWT_SECRET is not configured')
        res.status(500).json({
            error: 'Server configuration error'
        })
        return
    }

    try {
        const decoded = jwt.verify(token, jwtSecret)
        if(
            typeof decoded === 'string' ||
            typeof decoded.sub !== 'string' ||
            typeof decoded.username !== 'string'
        ) {
            res.status(401).json({
                error: 'invalid token payload'
            })
            return
        }
        
        const user = decoded as AuthTokenPayload
        res.locals.user = {
            id: decoded.sub,
            username: decoded.username
        }
        next()

    } catch (error) {
        res.status(401).json({
            error: 'Invalid or expired token'
        })
    }
}