import { Router } from 'express'
import { GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { db, tableName } from '../db/dynamodb.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/:id/members', async (req, res) => {
    try {
        const { id } = req.params

        const channelResult = await db.send(new GetCommand({
            TableName: tableName,
            Key: {
                PK: `CHANNEL#${id}`,
                SK: 'META'
            }
        }))

        if (!channelResult.Item) {
            res.status(404).json({
                error: 'Channel not found'
            })
            return
        }

        const members: {
            id: string
            username: string
        }[] = []

        let lastEvaluatedKey: Record<string, unknown> | undefined

        do {
            const result = await db.send(new QueryCommand({
                TableName: tableName,
                KeyConditionExpression:
                    'PK = :pk AND begins_with(SK, :sk)',
                ExpressionAttributeValues: {
                    ':pk': `CHANNEL#${id}`,
                    ':sk': 'MEMBER#'
                },
                ExclusiveStartKey: lastEvaluatedKey
            }))

            for (const item of result.Items ?? []) {
                if (
                    typeof item.userId === 'string' &&
                    typeof item.username === 'string'
                ) {
                    members.push({
                        id: item.userId,
                        username: item.username
                    })
                }
            }

            lastEvaluatedKey = result.LastEvaluatedKey
        } while (lastEvaluatedKey)

        members.sort((a, b) =>
            a.username.localeCompare(b.username)
        )
        res.json(members)

    } catch (error) {
        console.error('Could not fetch members:', error)
        res.status(500).json({
            error: 'Could not fetch channel members'
        })
    }
})

router.post('/:id/members', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params

        const channelResult = await db.send(new GetCommand({
            TableName: tableName,
            Key: {
                PK: `CHANNEL#${id}`,
                SK: 'META'
            }
        }))

        if (!channelResult.Item) {
            res.status(404).json({
                error: 'Channel not found'
            })
            return
        }

        const user = res.locals.user

        const membership = {
            PK: `CHANNEL#${id}`,
            SK: `MEMBER#${user.id}`,
            userId: user.id,
            username: user.username,
            joinedAt: new Date().toISOString()
        }

        try {
            await db.send(new PutCommand({
                TableName: tableName,
                Item: membership,
                ConditionExpression:
                    'attribute_not_exists(PK) AND attribute_not_exists(SK)'
            }))
        } catch (error) {
            if (
                error instanceof Error &&
                error.name === 'ConditionalCheckFailedException'
            ) {
                res.status(200).json({
                    message: 'Already a channel member'
                })
                return
            }

            throw error
        }

        res.status(201).json({
            message: 'Joined channel successfully'
        })

    } catch (error) {
        console.error('Could not join channel:', error)

        res.status(500).json({
            error: 'Could not join channel'
        })
    }
})

export default router
