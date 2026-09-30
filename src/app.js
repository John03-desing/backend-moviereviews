import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/auth.routes.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN }))
app.use(express.json({ limit: '10kb' }))

app.use('/api/auth', authRoutes)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

export default app