const TMDB_BASE_URL = process.env.TMDB_BASE_URL
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

const tmdbRequest = async (path) => {
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
            'Error al obtener información desde TMDB'
        )

        error.status = response.status
        throw error
    }

    return response.json()
}

const getCurrentMonthDates = () => {
    const now = new Date()

    const year = now.getFullYear()
    const month = now.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const format = (date) => {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')

        return `${y}-${m}-${d}`
    }

    return {
        start: format(firstDay),
        end: format(lastDay),
    }
}

const formatPerson = (person, role, featured = false) => ({
    id: person.id,
    name: person.name,
    role,
    featured,
    image: person.profile_path
        ? `${IMAGE_BASE_URL}${person.profile_path}`
        : null,
})

export const getFeaturedPeople = async () => {
    const popularMovies = await tmdbRequest(
        '/discover/movie?' +
        new URLSearchParams({
            language: 'es-MX',
            region: 'MX',
            include_adult: 'false',
            include_video: 'false',
            sort_by: 'popularity.desc',
            page: '1',
        })
    )

    const mainMovie = popularMovies.results.find(
        movie => movie.id
    )

    if (!mainMovie) {
        throw new Error(
            'No se encontró una película para obtener el reparto'
        )
    }

    const credits = await tmdbRequest(
        `/movie/${mainMovie.id}/credits?language=es-MX`
    )

    const cast = credits.cast
        .filter(person => person.profile_path)
        .sort((a, b) => a.order - b.order)

    if (cast.length < 2) {
        throw new Error(
            'No hay suficiente información del reparto'
        )
    }
    const protagonist = cast[0]
    const supportingActor = cast
        .filter(person => person.id !== protagonist.id)
        .sort(
            (a, b) =>
                (b.popularity ?? 0) -
                (a.popularity ?? 0)
        )[0]

    const { start, end } = getCurrentMonthDates()

    const monthlyMovies = await tmdbRequest(
        '/discover/movie?' +
        new URLSearchParams({
            language: 'es-MX',
            region: 'MX',
            include_adult: 'false',
            include_video: 'false',
            sort_by: 'popularity.desc',
            'release_date.gte': start,
            'release_date.lte': end,
            page: '1',
        })
    )

    const movies = monthlyMovies.results.slice(0, 5)
    const monthlyCredits = await Promise.all(
        movies.map(movie =>
            tmdbRequest(
                `/movie/${movie.id}/credits?language=es-MX`
            )
        )
    )

    const monthlyActors = monthlyCredits
        .flatMap(movieCredits =>
            movieCredits.cast
                .filter(person =>
                    person.profile_path &&
                    person.order <= 5
                )
        )
    const uniqueActors = Array.from(
        new Map(
            monthlyActors.map(person => [
                person.id,
                person,
            ])
        ).values()
    )
    const actorOfMonth = uniqueActors
        .filter(person =>
            person.id !== protagonist.id &&
            person.id !== supportingActor?.id
        )
        .sort(
            (a, b) =>
                (b.popularity ?? 0) -
                (a.popularity ?? 0)
        )[0]

    return [
        formatPerson(
            protagonist,
            'Protagonista destacado'
        ),

        formatPerson(
            actorOfMonth || protagonist,
            'Actor del mes',
            true
        ),

        formatPerson(
            supportingActor,
            'Reparto destacado'
        ),
    ]
}