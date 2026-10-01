import { z } from 'zod'

export const createReviewSchema = z.object({
    movieId: z.coerce
        .number()
        .int()
        .positive('La película seleccionada no es válida'),

    comment: z
        .string()
        .trim()
        .min(1, 'La reseña es obligatoria')
        .max(1000, 'La reseña no puede superar 1000 caracteres'),

    rating: z.coerce
        .number()
        .int()
        .min(1, 'La calificación mínima es 1')
        .max(10, 'La calificación máxima es 10'),
})

export const updateReviewSchema = z.object({
    movieId: z.coerce
        .number()
        .int()
        .positive(),

    comment: z
        .string()
        .trim()
        .min(1, 'La reseña es obligatoria')
        .max(
            1000,
            'La reseña no puede superar 1000 caracteres'
        ),

    rating: z.coerce
        .number()
        .int()
        .min(1)
        .max(10)
})