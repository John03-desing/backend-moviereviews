import { z } from 'zod'

export const createReviewSchema = z.object({
    movie_id: z.number().int().positive(),

    rating: z
        .number()
        .int()
        .min(1)
        .max(10),

    comment: z
        .string()
        .min(5)
        .max(1000)
})