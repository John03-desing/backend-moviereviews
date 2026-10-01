import { Router } from 'express'

import { getFavorites, addFavorite, removeFavorite } from '../controllers/favorite.controller.js'

import { authenticate } from '../middlewares/auth.middleware.js'

import { validate } from '../middlewares/validate.middleware.js'

import { addFavoriteSchema } from '../validators/favorite.validator.js'


const router = Router()

router.get(
    '/',
    authenticate,
    getFavorites
)

router.post(
    '/',
    authenticate,
    validate(addFavoriteSchema),
    addFavorite
)

router.delete(
    '/:movieId',
    authenticate,
    removeFavorite
)

export default router