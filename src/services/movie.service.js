import {
    tmdbRequest,
    getImageUrl
} from './tmdb.service.js'


export const searchMovies = async (query) => {
    if (!query?.trim()) {
        return []
    }

    const params = new URLSearchParams({
        query: query.trim(),
        language: 'es-MX',
        region: 'MX',
        include_adult: 'false',
        page: '1',
    })

    const data = await tmdbRequest(
        `/search/movie?${params.toString()}`
    )

    return data.results
        .filter(movie => movie.poster_path)
        .slice(0, 8)
        .map(movie => ({
            id: movie.id,
            title: movie.title,
            releaseDate: movie.release_date,
            year: movie.release_date
                ? movie.release_date.slice(0, 4)
                : null,
            posterUrl: getImageUrl(movie.poster_path),
            genreIds: movie.genre_ids || [],
        }))
}


export const getMovieDetails = async (movieId) => {
    const movie = await tmdbRequest(
        `/movie/${movieId}?language=es-MX`
    )

    return {
        id: movie.id,
        title: movie.title,
        releaseDate: movie.release_date,
        year: movie.release_date
            ? movie.release_date.slice(0, 4)
            : null,
        posterUrl: getImageUrl(movie.poster_path),
        genres: movie.genres || [],
    }
}


export const getMovieGenres = async () => {
    const data = await tmdbRequest(
        '/genre/movie/list?language=es-MX'
    )

    return data.genres
}


export const getUpcomingMovies = async () => {
    const today = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Mexico_City',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date())

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

    const data = await tmdbRequest(
        `/discover/movie?${params.toString()}`
    )

    return data.results
        .filter(movie =>
            movie.poster_path &&
            movie.release_date
        )
        .slice(0, 3)
        .map(movie => ({
            id: movie.id,
            title: movie.title,
            releaseDate: movie.release_date,
            year: movie.release_date.slice(0, 4),
            posterUrl: getImageUrl(movie.poster_path),
        }))
}