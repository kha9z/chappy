import express from 'express'
import channelRouter from './routes/channelRouter.js'
import userRouter from './routes/userRouter.js'

const app = express()
const port = 6767

app.use(express.json())
app.use('/api/channels', channelRouter)
app.use('/api/users', userRouter)
app.listen(port, () => {
    console.log(`Chappy API running on http://localhost:${port}`)
})