import express from 'express'
import channelRouter from './routes/channelRouter.js'
import { channel } from 'node:diagnostics_channel'

const app = express()
const port = 6767

app.use(express.json())

app.use('/api/channels', channelRouter)

app.listen(port, () => {
    console.log(`Chappy API running on http://localhost:${port}`)
})