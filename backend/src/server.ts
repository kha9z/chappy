import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import channelRouter from './routes/channelRouter.js'
import userRouter from './routes/userRouter.js'
import messageRouter from './routes/messageRouter.js'

const app = express()
const PORT = Number(process.env.PORT) || 6767

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const frontendPath = path.resolve(__dirname, '../../frontend/dist')

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://chappy-1-fqew.onrender.com'
    ]
}))

app.use(express.json())

app.use('/api/channels', channelRouter)
app.use('/api/users', userRouter)
app.use('/api/channels', messageRouter)

app.use(express.static(frontendPath))

app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'))
})

app.listen(PORT, () => {
    console.log(`Chappy running on port ${PORT}`)
})
