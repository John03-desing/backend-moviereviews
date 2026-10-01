const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export const tmdbRequest = async (path) => {
    const response = await fetch(
        `${TMDB_BASE_URL}${path}`,
        {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
            },
        }
    )

    if (!response.ok) {
        const error = new Error(
            'Error al consultar TMDB'
        )

        error.status = response.status
        throw error
    }

    return response.json()
}

export const getImageUrl = (path) => {
    if (!path) return null
    return `${IMAGE_BASE_URL}${path}`
}