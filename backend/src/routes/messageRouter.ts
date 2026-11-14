import { Router } from 'express'
import { GetCommand, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { db, tableName } from '../db/dynamodb.js'
import { checkAuthMiddleware, authMiddleware } from '../middleware/authMiddleware.js'
import { randomUUID } from 'node:crypto'
import { createMessageSchema } from '@chappy/shared'

const router = Router()

router.get('/:id/messages', checkAuthMiddleware, async (req, res) => {
    const { id } = req.params

    if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(id)) {
        res.status(400).json({ error: 'Invalid channel ID' })
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

        if (channel.isLocked && !res.locals.user) {
            res.status(401).json({
                error: 'Login required'
            })
            return
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

router.post('/:id/messages', authMiddleware, async (req, res) => {
    const { id } = req.params

    if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(id)) {
        res.status(400).json({ error: 'Invalid channel ID' })
        return
    }

    const parsed = createMessageSchema.safeParse(req.body)

    if (!parsed.success) {
        res.status(400).json({
            error: 'Invalid message',
            details: parsed.error.flatten()
        })
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

        if (!channelResult.Item) {
            res.status(404).json({ error: 'Channel not found' })
            return
        }

        const messageId = randomUUID()
        const createdAt = new Date().toISOString()

        const message = {
            PK: `CHANNEL#${id}`,
            SK: `MESSAGE#${createdAt}#${messageId}`,
            id: messageId,
            channelId: id,
            username: res.locals.user.username,
            content: parsed.data.content,
            createdAt
        }

        await db.send(new PutCommand({
            TableName: tableName,
            Item: message,
            ConditionExpression: 'attribute_not_exists(PK)'
        }))
        res.status(201).json(message)

    } catch (error) {
        if (
            error instanceof Error &&
            error.name === 'ConditionalCheckFailedException'
        ) {
            res.status(409).json({ error: 'Message already exists' })
            return
        }

        console.error('Could not create message:', error)
        res.status(500).json({ error: 'Could not create message' })
    }})

    export default router