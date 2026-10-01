import { Router } from 'express'
import { getAdminReviews, deleteReviewAsAdmin } from '../controllers/review.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { requireAdmin } from '../middlewares/admin.middleware.js'

const router = Router()

router.get(
    '/reviews',
    authenticate,
    requireAdmin,
    getAdminReviews
)

router.delete(
    '/reviews/:id',
    authenticate,
    requireAdmin,
    deleteReviewAsAdmin
)

export default router