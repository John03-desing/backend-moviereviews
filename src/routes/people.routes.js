import { Router } from 'express'

import {
    getFeaturedPeople
} from '../controllers/people.controller.js'

const router = Router()

router.get('/featured', getFeaturedPeople)

export default router