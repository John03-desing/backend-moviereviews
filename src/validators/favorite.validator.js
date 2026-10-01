import { z } from 'zod'

export const addFavoriteSchema = z.object({
    movieId: z.coerce
        .number()
        .int()
        .positive()
})