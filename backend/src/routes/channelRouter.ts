import { Router } from 'express'
import { GetCommand, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { db, tableName } from '../db/dynamodb.js'
import { createChannelSchema } from '@chappy/shared'

const router = Router()

router.get('/', async (req, res) => {
try {
    const command = new ScanCommand({
        TableName: tableName,
        FilterExpression: 'SK = :sk AND begins_with(PK, :pk)',
        ExpressionAttributeValues: {
            ':sk': 'META',
            ':pk': 'CHANNEL#'
        }
    })
    const result = await db.send(command)
    res.json(result.Items ?? [])

} catch (error) {

    console.error(error)
    res.status(500).json({
        error: 'Could not fetch channels'
    })
}
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const command = new GetCommand({
            TableName: tableName,
            Key: {
                PK: `CHANNEL#${id}`,
                SK: 'META'
            }
        })

        const result = await db.send(command)

        if (!result.Item) {
            res.status(404).json({ error: 'Channel not found' })
            return
        }
        res.json(result.Item)

    } catch (error) {

        console.error(error)
        res.status(500).json({ error: 'could not fetch channel' })
    }
})

router.post('/', async (req, res) => {
    try {
        const validation = createChannelSchema.safeParse(req.body)

        if (!validation.success) {
            res.status(400).json({
                error: 'invalid channel data',
                details: validation.error.flatten()
            })
            return
        }

        const { id, name, description, isLocked} = validation.data

        const channel = {
            PK: `CHANNEL#${id}`,
            SK: 'META',
            name,
            description,
            isLocked,
            createdBy: 'system',
            createdAt: new Date().toISOString()
        }

        const command = new PutCommand({
            TableName: tableName,
            Item: channel,
            ConditionExpression: 'attribute_not_exists(PK)'
        })
        await db.send(command)
        res.status(201).json(channel)

    } catch (error) {

        if (
            error instanceof Error &&
            error.name === 'ConditionalCheckFailedException'
        ) {
            res.status(409).json({
                error: 'channel already exists'
            })
            return

        }
        console.error(error)
        res.status(500).json({
            error: 'could not create channel'
        })
    }
})

export default router 