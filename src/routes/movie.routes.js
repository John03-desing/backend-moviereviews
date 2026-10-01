import { Router } from 'express'
import { getUpcomingMovies, searchMovies, getGenres } from '../controllers/movie.controller.js'

const router = Router()

router.get('/upcoming', getUpcomingMovies)
router.get('/search', searchMovies)
router.get('/genres', getGenres)

export default router