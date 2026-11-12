import { Router } from 'express'
import { GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import jwt from 'jsonwebtoken'
import { db, tableName } from '../db/dynamodb.js'

const router = Router()

router.get('/:id/messages', async (req, res) => {
    const { id } = req.params
    
    if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(id)) {
        res.status(400).json({ error: 'Invalid channel ID'})
        return
    }
    
    try {
        const channelResult = await db.send(new GetCommand({
            TableName: tableName,
            Key: {
                PK: `CHANNEL#${id}`,
                SK: 'META'
            }
        }))
        
        const channel = channelResult.Item
        
        if (!channel) {
            res.status(404).json({ error: 'Channel not found' })
            return
        }
        
        if (channel.isLocked) {
            const authHeader = req.headers.authorization
            
            if (!authHeader?.startsWith('Bearer ')) {
                res.status(401).json({ error: 'Login required' })
                return
            }
            
            const jwtSecret = process.env.JWT_SECRET
            
            if (!jwtSecret) {
                console.error('JWT_SECRET is not configured')
                res.status(500).json({ error: 'Server configuration error' })
                return
            }
            
            try {
                const decoded = jwt.verify(authHeader.slice(7), jwtSecret)
                
                if (
                    typeof decoded === 'string' ||
                    typeof decoded.sub !== 'string' ||
                    typeof decoded.username !== 'string'
                ) {
                    res.status(401).json({ error: 'Invalid token' })
                    return
                }
            } catch {
                res.status(401).json({ error: 'Invalid or expired token' })
                return
            }
        }
        
        const result = await db.send(new QueryCommand({
            TableName: tableName,
            KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
            ExpressionAttributeValues: {
                ':pk': `CHANNEL#${id}`,
                ':prefix': 'MESSAGE#'
            },
            ScanIndexForward: false,
            Limit: 50
        }))
        
        res.json((result.Items ?? []).reverse())
    } catch (error) {
        console.error('Could not fetch messages:', error)
        res.status(500).json({ error: 'Could not fetch messages' })
    }
})

export default router