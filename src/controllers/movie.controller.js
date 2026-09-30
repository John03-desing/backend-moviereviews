import * as movieService from '../services/movie.service.js'

export const getUpcomingMovies = async (req, res, next) => {
    try {
        const movies = await movieService.getUpcomingMovies()

        return res.status(200).json({
            movies
        })
    } catch (error) {
        next(error)
    }
}