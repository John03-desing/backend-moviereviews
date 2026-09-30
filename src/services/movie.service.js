const TMDB_BASE_URL = process.env.TMDB_BASE_URL
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN

const getMexicoDate = () => {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Mexico_City',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date())
}

export const getUpcomingMovies = async () => {
    const today = getMexicoDate()

    const params = new URLSearchParams({
        language: 'es-MX',
        region: 'MX',
        page: '1',
        sort_by: 'primary_release_date.asc',
        'release_date.gte': today,
        include_adult: 'false',
        include_video: 'false',
        with_release_type: '3|2',
    })

    const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?${params.toString()}`,
        {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
            },
        }
    )

    if (!response.ok) {
        const error = new Error(
            'Error al obtener los próximos estrenos desde TMDB'
        )

        error.status = response.status

        throw error
    }

    const data = await response.json()

    const movies = data.results
        .filter(movie =>
            movie.poster_path &&
            movie.release_date
        )
        .slice(0, 3)
        .map(movie => ({
            id: movie.id,
            title: movie.title,
            releaseDate: movie.release_date,
            posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }))

    return movies
}