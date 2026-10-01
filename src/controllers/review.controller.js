import * as reviewService
    from '../services/review.service.js'

export const createReview = async (req, res, next ) => {
    try {
        const review =
            await reviewService.createReview({
                userId: req.user.id,
                ...req.body,
            })

        return res.status(201).json({
            message:'Reseña publicada correctamente', review,
        })
    } catch (error) {
        next(error)
    }
}

export const getReviews = async ( req, res, next ) => {
    try {
        const reviews =
            await reviewService.getReviews({
                genreId: req.query.genreId
            })

        return res.status(200).json({
            reviews
        })
    } catch (error) {
        next(error)
    }
}

export const getMyReviews = async (req, res, next ) => {
    try {
        const reviews =
            await reviewService.getMyReviews(
                req.user.id
            )

        return res.status(200).json({
            reviews
        })
    } catch (error) {
        next(error)
    }
}

export const getMyReviewById = async (
    req,
    res,
    next
) => {
    try {
        const reviewId =
            Number(req.params.id)

        if (
            !Number.isInteger(reviewId) ||
            reviewId <= 0
        ) {
            return res.status(400).json({
                message: 'ID de reseña inválido'
            })
        }

        const review =
            await reviewService.getMyReviewById({
                reviewId,
                userId: req.user.id
            })

        return res.status(200).json({
            review
        })
    } catch (error) {
        next(error)
    }
}


export const updateReview = async (
    req,
    res,
    next
) => {
    try {
        const reviewId =
            Number(req.params.id)

        if (
            !Number.isInteger(reviewId) ||
            reviewId <= 0
        ) {
            return res.status(400).json({
                message: 'ID de reseña inválido'
            })
        }

        const review =
            await reviewService.updateReview({
                reviewId,
                userId: req.user.id,
                movieId: req.body.movieId,
                comment: req.body.comment,
                rating: req.body.rating
            })

        return res.status(200).json({
            message:
                'Reseña actualizada correctamente',
            review
        })
    } catch (error) {
        next(error)
    }
}


export const deleteReview = async (
    req,
    res,
    next
) => {
    try {
        const reviewId =
            Number(req.params.id)

        if (
            !Number.isInteger(reviewId) ||
            reviewId <= 0
        ) {
            return res.status(400).json({
                message: 'ID de reseña inválido'
            })
        }

        await reviewService.deleteReview({
            reviewId,
            userId: req.user.id
        })

        return res.status(200).json({
            message:
                'Reseña eliminada correctamente'
        })
    } catch (error) {
        next(error)
    }
}