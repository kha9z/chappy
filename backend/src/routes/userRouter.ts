import { Router } from 'express'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import bcrypt from 'bcrypt'
import { randomUUID } from 'node:crypto'
import { registerUserSchema } from '@chappy/shared'
import { db, tableName } from '../db/dynamodb.js'

const router = Router()

router.post('/register', async (req, res) => {
    try {
        const validation = registerUserSchema.safeParse(req.body)

        if (!validation.success) {
            res.status(400).json({
                error: 'Invalid registration data',
                details: validation.error.issues
            })
            return
        }

        const { username, password } = validation.data
        const normalizedUsername = username.toLowerCase()
        const passwordHash = await bcrypt.hash(password, 12)

        const user = {
            PK: `USER#${normalizedUsername}`,
            SK: `PROFILE`,
            id: randomUUID(),
            username,
            passwordHash,
            createdAt: new Date().toISOString()
        }

        const command = new PutCommand({
            TableName: tableName,
            Item: user,
            ConditionExpression: 'attribute_not_exists(PK)'
        })
        await db.send(command)

        res.status(201).json({
            message: 'User registered',
            user: {
                id: user.id,
                username: user.username,
                createdAt: user.createdAt
            }
        })
    } catch (error) {
        if (
            error instanceof Error &&
            error.name === 'ConditionalCheckFailedException'
        ) {
            res.status(409).json ({
                error: 'Username already exists'
            })
            return
        }
        console.log(error)
        res.status(500).json({
            error: 'could not register user'
        })
    }
})

export default router