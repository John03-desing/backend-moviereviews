import * as favoriteService
    from '../services/favorite.service.js'


export const getFavorites = async (
    req,
    res,
    next
) => {
    try {
        const favorites =
            await favoriteService.getFavorites(
                req.user.id
            )

        return res.status(200).json({
            favorites
        })
    } catch (error) {
        next(error)
    }
}


export const addFavorite = async (
    req,
    res,
    next
) => {
    try {
        const favorite =
            await favoriteService.addFavorite({
                userId: req.user.id,
                movieId: req.body.movieId
            })

        return res.status(201).json({
            message:
                'Película añadida a favoritos',

            favorite
        })
    } catch (error) {
        next(error)
    }
}


export const removeFavorite = async (
    req,
    res,
    next
) => {
    try {
        await favoriteService.removeFavorite({
            userId: req.user.id,
            movieId: Number(
                req.params.movieId
            )
        })

        return res.status(200).json({
            message:
                'Película eliminada de favoritos'
        })
    } catch (error) {
        next(error)
    }
}