import express from 'express'
import channelRouter from './routes/channelRouter.js'
import userRouter from './routes/userRouter.js'

const app = express()
const PORT = Number(process.env.PORT) || 6767

app.use(express.json())

app.use('/api/channels', channelRouter)
app.use('/api/users', userRouter)

app.listen(PORT, () => {
    console.log(`Chappy API running on port ${PORT}`)
})
