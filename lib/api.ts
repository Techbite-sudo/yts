const BASE_URL = "https://yts.mx/api/v2"

export interface Movie {
  id: number
  url: string
  imdb_code: string
  title: string
  title_english: string
  title_long: string
  slug: string
  year: number
  rating: number
  runtime: number
  genres: string[]
  summary: string
  description_full: string
  synopsis: string
  yt_trailer_code: string
  language: string
  mpa_rating: string
  background_image: string
  background_image_original: string
  small_cover_image: string
  medium_cover_image: string
  large_cover_image: string
  state: string
  torrents: Torrent[]
  date_uploaded: string
  date_uploaded_unix: number
}

export interface Torrent {
  url: string
  hash: string
  quality: string
  type: string
  seeds: number
  peers: number
  size: string
  size_bytes: number
  date_uploaded: string
  date_uploaded_unix: number
}

export interface Cast {
  name: string
  character_name: string
  url_small_image: string
  imdb_code: string
}

export interface ListMoviesParams {
  limit?: number
  page?: number
  quality?: string
  minimum_rating?: number
  query_term?: string
  genre?: string
  sort_by?: string
  order_by?: string
  with_rt_ratings?: boolean
}

export interface MovieDetailsParams {
  movie_id: number
  with_images?: boolean
  with_cast?: boolean
}

export interface MovieSuggestionsParams {
  movie_id: number
}

export async function listMovies(params: ListMoviesParams = {}) {
  const url = new URL(`${BASE_URL}/list_movies.json`)
  Object.keys(params).forEach((key) => {
    const value = params[key as keyof ListMoviesParams]
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, String(value))
    }
  })

  try {
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    if (data.status === "ok") {
      return {
        movies: data.data.movies || [],
        movie_count: data.data.movie_count,
        limit: data.data.limit,
        page_number: data.data.page_number,
      }
    } else {
      throw new Error(data.status_message || "Failed to fetch movies")
    }
  } catch (error) {
    console.error("Error fetching movies:", error)
    return { movies: [], movie_count: 0, limit: 0, page_number: 0 }
  }
}

export async function getMovieDetails(params: MovieDetailsParams) {
  const url = new URL(`${BASE_URL}/movie_details.json`)
  Object.keys(params).forEach((key) => {
    const value = params[key as keyof MovieDetailsParams]
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, String(value))
    }
  })

  try {
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    if (data.status === "ok") {
      return data.data.movie as Movie & { cast?: Cast[] }
    } else {
      throw new Error(data.status_message || "Failed to fetch movie details")
    }
  } catch (error) {
    console.error("Error fetching movie details:", error)
    return null
  }
}

export async function getMovieSuggestions(params: MovieSuggestionsParams) {
  const url = new URL(`${BASE_URL}/movie_suggestions.json`)
  Object.keys(params).forEach((key) => {
    const value = params[key as keyof MovieSuggestionsParams]
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, String(value))
    }
  })

  try {
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    if (data.status === "ok") {
      return data.data.movies as Movie[]
    } else {
      throw new Error(data.status_message || "Failed to fetch movie suggestions")
    }
  } catch (error) {
    console.error("Error fetching movie suggestions:", error)
    return []
  }
}
