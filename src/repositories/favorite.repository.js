import pool from '../config/database.js'

export const findFavoritesByUser = async (userId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            user_id,
            movie_id,
            created_at
        FROM favorites
        WHERE user_id = $1
        ORDER BY created_at ASC
        `,
        [userId]
    )

    return result.rows
}

export const findFavoriteByUserAndMovie = async (
    userId,
    movieId
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM favorites
        WHERE user_id = $1
          AND movie_id = $2
        `,
        [userId, movieId]
    )

    return result.rows[0]
}

export const countFavoritesByUser = async (userId) => {
    const result = await pool.query(
        `
        SELECT COUNT(*)::int AS total
        FROM favorites
        WHERE user_id = $1
        `,
        [userId]
    )

    return result.rows[0].total
}

export const createFavorite = async ({
    userId,
    movieId
}) => {
    const result = await pool.query(
        `
        INSERT INTO favorites (
            user_id,
            movie_id
        )
        VALUES ($1, $2)
        RETURNING *
        `,
        [userId, movieId]
    )

    return result.rows[0]
}

export const deleteFavorite = async ({
    userId,
    movieId
}) => {
    const result = await pool.query(
        `
        DELETE FROM favorites
        WHERE user_id = $1
          AND movie_id = $2
        RETURNING *
        `,
        [userId, movieId]
    )

    return result.rows[0]
}