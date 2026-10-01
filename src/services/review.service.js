import {
    createReview as createReviewRepository,
    findByUserAndMovie,
    findPublishedReviews,
    findReviewsByUser,
    findReviewByIdAndUser,
    updateReviewByIdAndUser,
    deleteReviewByIdAndUser,
    findReviewsForAdmin,
    deleteReviewByAdmin
} from '../repositories/review.repository.js'

import { getMovieDetails } from './movie.service.js'

export const createReview = async ({userId, movieId, rating, comment}) => {
    const movie = await getMovieDetails(movieId)

    if (!movie) {
        const error = new Error(
            'La película seleccionada no existe'
        )

        error.status = 400
        throw error
    }

    /*
     * Un usuario solo puede reseñar
     * una vez cada película.
     */
    const existingReview =
        await findByUserAndMovie(
            userId,
            movieId
        )

    if (existingReview) {
        const error = new Error('Ya has publicado una reseña para esta película')
        error.status = 409
        throw error
    }

    return createReviewRepository({
        userId,
        movieId,
        rating,
        comment
    })
}

const enrichReview = async (review) => {
    const movieId =
        review.movieId ??
        review.movie_id

    const userId =
        review.userId ??
        review.user_id

    const createdAt =
        review.createdAt ??
        review.created_at

    const updatedAt =
        review.updatedAt ??
        review.updated_at

    if (!movieId) {
        const error = new Error(
            'La reseña no contiene un movieId válido'
        )

        error.status = 500
        throw error
    }

    const movie =
        await getMovieDetails(movieId)

    return {
        id: review.id,

        movieId,

        comment: review.comment,

        rating: review.rating,

        createdAt,

        updatedAt,

        user: {
            id: userId,
            username: review.username,
        },

        movie: {
            id: movie.id,
            title: movie.title,
            posterUrl: movie.posterUrl,
            year: movie.year,
            genres: movie.genres,
        }
    }
}

export const getReviews = async ({
    genreId
} = {}) => {
    const reviews =
        await findPublishedReviews()

    const enriched = await Promise.all(
        reviews.map(enrichReview)
    )

    if (!genreId) {
        return enriched
    }

    const genre = Number(genreId)

    return enriched.filter(review =>
        review.movie.genres.some(
            item => item.id === genre
        )
    )
}

export const getMyReviews = async (userId) => {
    const reviews =
        await findReviewsByUser(userId)

    return Promise.all(
        reviews.map(enrichReview)
    )
}

export const getMyReviewById = async ({
    reviewId,
    userId
}) => {
    const review =
        await findReviewByIdAndUser(
            reviewId,
            userId
        )

    if (!review) {
        const error =
            new Error('Reseña no encontrada')

        error.status = 404

        throw error
    }

    return enrichReview(review)
}


export const updateReview = async ({
    reviewId,
    userId,
    movieId,
    comment,
    rating
}) => {
    const existing =
        await findReviewByIdAndUser(
            reviewId,
            userId
        )

    if (!existing) {
        const error =
            new Error('Reseña no encontrada')

        error.status = 404

        throw error
    }

    // Comprueba que la película existe en TMDB
    await getMovieDetails(movieId)

    try {
        const updated =
            await updateReviewByIdAndUser({
                reviewId,
                userId,
                movieId,
                comment,
                rating
            })

        return enrichReview({
            ...updated,
            username: existing.username
        })
    } catch (error) {
        /*
         * PostgreSQL 23505 = unique violation.
         *
         * DB solo permite una reseña
         * por usuario y película.
         */
        if (error.code === '23505') {
            const conflict =
                new Error(
                    'Ya tienes una reseña para esa película'
                )

            conflict.status = 409

            throw conflict
        }

        throw error
    }
}


export const deleteReview = async ({
    reviewId,
    userId
}) => {
    const deleted =
        await deleteReviewByIdAndUser({
            reviewId,
            userId
        })

    if (!deleted) {
        const error =
            new Error('Reseña no encontrada')

        error.status = 404

        throw error
    }

    return deleted
}
/*Seccion del Admin*/
export const getAdminReviews = async ({ username = '' } = {}) => {
    const reviews =
        await findReviewsForAdmin(
            username
        )

    return Promise.all(
        reviews.map(enrichReview)
    )
}


export const adminDeleteReview = async ( reviewId ) => {
    const deleted =
        await deleteReviewByAdmin(
            reviewId
        )

    if (!deleted) {
        const error =
            new Error(
                'Reseña no encontrada'
            )

        error.status = 404

        throw error
    }

    return deleted
}