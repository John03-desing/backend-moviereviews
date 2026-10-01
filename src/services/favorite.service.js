import {
    findFavoritesByUser,
    findFavoriteByUserAndMovie,
    countFavoritesByUser,
    createFavorite as createFavoriteRepository,
    deleteFavorite as deleteFavoriteRepository
} from '../repositories/favorite.repository.js'

import {
    getMovieDetails
} from './movie.service.js'


export const getFavorites = async (userId) => {
    const favorites =
        await findFavoritesByUser(userId)

    return Promise.all(
        favorites.map(async favorite => {
            const movie =
                await getMovieDetails(
                    favorite.movie_id
                )

            return {
                id: favorite.id,

                createdAt:
                    favorite.created_at,

                movie: {
                    id: movie.id,
                    title: movie.title,
                    posterUrl: movie.posterUrl,
                    year: movie.year,
                }
            }
        })
    )
}


export const addFavorite = async ({
    userId,
    movieId
}) => {
    /*
     * Confirmamos que la película exista
     * realmente en TMDB.
     */
    await getMovieDetails(movieId)

    const existing =
        await findFavoriteByUserAndMovie(
            userId,
            movieId
        )

    if (existing) {
        const error = new Error(
            'Esta película ya está en favoritos'
        )

        error.status = 409
        throw error
    }

    const total =
        await countFavoritesByUser(userId)

    if (total >= 4) {
        const error = new Error(
            'Solo puedes guardar 4 películas favoritas'
        )

        error.status = 409
        throw error
    }

    return createFavoriteRepository({
        userId,
        movieId
    })
}


export const removeFavorite = async ({
    userId,
    movieId
}) => {
    const deleted =
        await deleteFavoriteRepository({
            userId,
            movieId
        })

    if (!deleted) {
        const error = new Error(
            'El favorito no existe'
        )

        error.status = 404
        throw error
    }

    return deleted
}