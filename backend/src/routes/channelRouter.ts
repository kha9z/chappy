import { Router } from 'express'
import { GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { db, tableName } from '../db/dynamodb.js'

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

export default router 