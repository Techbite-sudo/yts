"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { listMovies, type ListMoviesParams, type Movie } from "@/lib/api"
import { MovieCard } from "@/components/movie-card"
import { SearchFilterSort } from "@/components/search-filter-sort"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  /* -------- Memo-parse URL params -------- */
  const filterParams: ListMoviesParams = useMemo(() => {
    const p = new URLSearchParams(searchParams.toString())
    return {
      limit: Number.parseInt(p.get("limit") || "20"),
      page: Number.parseInt(p.get("page") || "1"),
      quality: p.get("quality") || undefined,
      minimum_rating: Number.parseInt(p.get("minimum_rating") || "0") || undefined,
      query_term: p.get("query_term") || undefined,
      genre: p.get("genre") || undefined,
      sort_by: p.get("sort_by") || "date_added",
      order_by: p.get("order_by") || "desc",
    }
  }, [searchParams])

  /* -------- Movie data state -------- */
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [movieCount, setMovieCount] = useState(0)
  const [limit, setLimit] = useState(20) // This limit is from the API response, not the request param

  /* -------- Fetch helper -------- */
  const fetchMovies = useCallback(async (params: ListMoviesParams) => {
    setLoading(true)
    // console.log("Fetching movies with params:", params) // Uncomment for debugging
    const data = await listMovies(params)
    // console.log("Received movie data:", data) // Uncomment for debugging
    setMovies(data.movies)
    setMovieCount(data.movie_count)
    setLimit(data.limit) // Update limit based on API response
    setLoading(false)
  }, [])

  /* -------- Fetch whenever URL params change -------- */
  useEffect(() => {
    fetchMovies(filterParams)
  }, [filterParams, fetchMovies])

  /* -------- URL helpers -------- */
  const updateQuery = (params: Partial<ListMoviesParams>) => {
    const qs = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "" || (k === "minimum_rating" && v === 0)) {
        qs.delete(k)
      } else {
        qs.set(k, String(v))
      }
    })
    router.push(`/?${qs.toString()}`)
  }

  const handleApplyFilters = (p: ListMoviesParams) => updateQuery({ ...p, page: 1 })
  const handlePageChange = (newPage: number) => updateQuery({ page: newPage })

  const totalPages = Math.max(1, Math.ceil(movieCount / limit))
  const currentPage = filterParams.page ?? 1 // Use filterParams.page directly

  /* -------- UI -------- */
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">YTS Movie Browser</h1>

      <SearchFilterSort onApplyFilters={handleApplyFilters} initialParams={filterParams} />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-8">
          {Array.from({ length: limit }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-8">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
              variant="outline"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center text-muted-foreground mt-16 text-lg">No movies found matching your criteria.</div>
      )}
    </div>
  )
}
