import { Router } from 'express'
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import bcrypt from 'bcrypt'
import { randomUUID } from 'node:crypto'
import { registerUserSchema, loginUserSchema } from '@chappy/shared'
import { db, tableName } from '../db/dynamodb.js'
import jwt from 'jsonwebtoken'

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
            res.status(409).json({
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

router.post('/login', async (req, res) => {
    try {
        const validation = loginUserSchema.safeParse(req.body)

        if (!validation.success) {
            res.status(400).json({
                error: 'Invalid login data',
                details: validation.error.issues
            })
            return
        }

        const { username, password } = validation.data
        const normalizedUsername = username.toLowerCase()

        const command = new GetCommand({
            TableName: tableName,
            Key: {
                PK: `USER#${normalizedUsername}`,
                SK: 'PROFILE'
            }
        })

        const result = await db.send(command)
        if (!result.Item) {
            res.status(401).json({
                error: 'Invalid username or password'
            })
            return
        }

        const passwordMatches = await bcrypt.compare(
            password,
            result.Item.passwordHash
        )

        if (!passwordMatches) {
            res.status(401).json({
                error: 'Invalid username or password'
            })
            return
        }

        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not configured')
        }

        const token = jwt.sign(
            { username: result.Item.username },
            jwtSecret,
            {
                subject: result.Item.id,
                expiresIn: '1h'
            }
        )

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: result.Item.id,
                username: result.Item.username
            }
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            error: 'Could not log in'
        })
    }
})

export default router