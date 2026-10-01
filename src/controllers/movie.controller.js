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

export const searchMovies = async (req, res, next) => {
    try {
        const { query } = req.query

        if (!query?.trim()) {
            return res.status(400).json({
                message: 'Debes escribir una película'
            })
        }

        const movies = await movieService.searchMovies(query)

        return res.status(200).json({
            movies
        })
    } catch (error) {
        next(error)
    }
}

export const getGenres = async (req, res, next) => {
    try {
        const genres = await movieService.getMovieGenres()

        return res.status(200).json({
            genres
        })
    } catch (error) {
        next(error)
    }
}