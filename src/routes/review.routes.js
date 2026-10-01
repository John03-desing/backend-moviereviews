import { Router } from 'express'

import { createReview, getReviews, getMyReviews,
         getMyReviewById, updateReview, deleteReview
 } from '../controllers/review.controller.js'

import { authenticate } from '../middlewares/auth.middleware.js'

import { validate } from '../middlewares/validate.middleware.js'

import { createReviewSchema, updateReviewSchema } from '../validators/review.validator.js'

const router = Router()
/* publico */
router.get('/', getReviews)

/* Usuario autenticado */
router.get(
    '/mine',
    authenticate,
    getMyReviews
)

router.get(
    '/mine/:id',
    authenticate,
    getMyReviewById
)

router.post(
    '/',
    authenticate,
    validate(createReviewSchema),
    createReview
)

router.put(
    '/:id',
    authenticate,
    validate(updateReviewSchema),
    updateReview
)

router.delete(
    '/:id',
    authenticate,
    deleteReview
)

export default router