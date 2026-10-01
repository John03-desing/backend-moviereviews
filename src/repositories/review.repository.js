import pool from '../config/database.js'

export const createReview = async ({
    userId,
    movieId,
    rating,
    comment
}) => {
    const result = await pool.query(
        `
        INSERT INTO reviews (
            user_id,
            movie_id,
            rating,
            comment
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
            userId,
            movieId,
            rating,
            comment
        ]
    )

    return result.rows[0]
}

export const findByUserAndMovie = async (
    userId,
    movieId
) => {
    const result = await pool.query(
        `
        SELECT id
        FROM reviews
        WHERE user_id = $1
          AND movie_id = $2
        `,
        [userId, movieId]
    )

    return result.rows[0]
}

export const findPublishedReviews = async () => {
    const result = await pool.query(
        `
        SELECT
            r.id,
            r.movie_id,
            r.user_id,
            r.rating,
            r.comment,
            r.created_at,
            r.updated_at,
            u.username
        FROM reviews r
        INNER JOIN users u
            ON u.id = r.user_id
        WHERE r.status = 'published'
        ORDER BY r.created_at DESC
        `
    )

    return result.rows
}

export const findReviewsByUser = async (userId) => {
    const result = await pool.query(
        `
        SELECT
            r.id,
            r.movie_id,
            r.user_id,
            r.rating,
            r.comment,
            r.created_at,
            r.updated_at,
            u.username
        FROM reviews r
        INNER JOIN users u
            ON u.id = r.user_id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC
        `,
        [userId]
    )

    return result.rows
}


export const findReviewByIdAndUser = async (
    reviewId,
    userId
) => {
    const result = await pool.query(
        `
        SELECT
            r.id,
            r.movie_id AS "movieId",
            r.user_id AS "userId",
            r.rating,
            r.comment,
            r.created_at AS "createdAt",
            r.updated_at AS "updatedAt",
            u.username
        FROM reviews r
        INNER JOIN users u
            ON u.id = r.user_id
        WHERE r.id = $1
          AND r.user_id = $2
        `,
        [
            reviewId,
            userId
        ]
    )

    return result.rows[0]
}


export const updateReviewByIdAndUser = async ({
    reviewId,
    userId,
    movieId,
    comment,
    rating
}) => {
    const result = await pool.query(
        `
        UPDATE reviews
        SET
            movie_id = $3,
            comment = $4,
            rating = $5,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND user_id = $2
        RETURNING
            id,
            movie_id AS "movieId",
            user_id AS "userId",
            rating,
            comment,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        [
            reviewId,
            userId,
            movieId,
            comment,
            rating
        ]
    )

    return result.rows[0]
}


export const deleteReviewByIdAndUser = async ({
    reviewId,
    userId
}) => {
    const result = await pool.query(
        `
        DELETE FROM reviews
        WHERE id = $1
          AND user_id = $2
        RETURNING id
        `,
        [
            reviewId,
            userId
        ]
    )

    return result.rows[0]
}