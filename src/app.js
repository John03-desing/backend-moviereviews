import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/auth.routes.js'
import { errorHandler } from './middlewares/error.middleware.js'
import movieRoutes from './routes/movie.routes.js'
import peopleRoutes from './routes/people.routes.js'
import reviewRoutes from './routes/review.routes.js'
import favoriteRoutes from './routes/favorite.routes.js'
import adminRoutes from './routes/admin.routes.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/movies', movieRoutes)
app.use('/api/people', peopleRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/admin', adminRoutes)

app.use(errorHandler)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

export default app