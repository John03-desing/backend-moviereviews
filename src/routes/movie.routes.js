import { Router } from 'express'
import { getUpcomingMovies } from '../controllers/movie.controller.js'

const router = Router()

router.get('/upcoming', getUpcomingMovies)

export default router