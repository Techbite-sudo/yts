"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useState, useEffect } from "react"
import type { ListMoviesParams } from "@/lib/api"

interface SearchFilterSortProps {
  onApplyFilters: (params: ListMoviesParams) => void
  initialParams: ListMoviesParams
}

const qualities = ["All", "480p", "720p", "1080p", "1080p.x265", "2160p", "3D"]
const genres = [
  "All",
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Film-Noir",
  "History",
  "Horror",
  "Music",
  "Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Short",
  "Sport",
  "Thriller",
  "War",
  "Western",
]
const sortByOptions = [
  { value: "date_added", label: "Date Added" },
  { value: "title", label: "Title" },
  { value: "year", label: "Year" },
  { value: "rating", label: "Rating" },
  { value: "peers", label: "Peers" },
  { value: "seeds", label: "Seeds" },
  { value: "download_count", label: "Download Count" },
  { value: "like_count", label: "Like Count" },
]
const orderByOptions = [
  { value: "desc", label: "Descending" },
  { value: "asc", label: "Ascending" },
]

export function SearchFilterSort({ onApplyFilters, initialParams }: SearchFilterSortProps) {
  const [queryTerm, setQueryTerm] = useState(initialParams.query_term || "")
  const [quality, setQuality] = useState(initialParams.quality || "All")
  const [genre, setGenre] = useState(initialParams.genre || "All")
  const [minimumRating, setMinimumRating] = useState(initialParams.minimum_rating?.toString() || "0")
  const [sortBy, setSortBy] = useState(initialParams.sort_by || "date_added")
  const [orderBy, setOrderBy] = useState(initialParams.order_by || "desc")

  useEffect(() => {
    setQueryTerm(initialParams.query_term || "")
    setQuality(initialParams.quality || "All")
    setGenre(initialParams.genre || "All")
    setMinimumRating(initialParams.minimum_rating?.toString() || "0")
    setSortBy(initialParams.sort_by || "date_added")
    setOrderBy(initialParams.order_by || "desc")
  }, [initialParams])

  const handleApply = () => {
    onApplyFilters({
      query_term: queryTerm || undefined,
      quality: quality === "All" ? undefined : quality,
      genre: genre === "All" ? undefined : genre,
      minimum_rating: Number.parseInt(minimumRating) || undefined,
      sort_by: sortBy,
      order_by: orderBy,
    })
  }

  const handleClear = () => {
    setQueryTerm("")
    setQuality("All")
    setGenre("All")
    setMinimumRating("0")
    setSortBy("date_added")
    setOrderBy("desc")
    onApplyFilters({}) // Apply empty filters
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-card rounded-lg shadow-md">
      <div className="col-span-full sm:col-span-2 lg:col-span-1 xl:col-span-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search movies..."
            value={queryTerm}
            onChange={(e) => setQueryTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleApply()
              }
            }}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <Select value={quality} onValueChange={setQuality}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Quality" />
        </SelectTrigger>
        <SelectContent>
          {qualities.map((q) => (
            <SelectItem key={q} value={q}>
              {q}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={genre} onValueChange={setGenre}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Genre" />
        </SelectTrigger>
        <SelectContent>
          {genres.map((g) => (
            <SelectItem key={g} value={g}>
              {g}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={minimumRating} onValueChange={setMinimumRating}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Min Rating" />
        </SelectTrigger>
        <SelectContent>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((r) => (
            <SelectItem key={r} value={r.toString()}>
              {r === 0 ? "Any Rating" : `${r}+ IMDb`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          {sortByOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={orderBy} onValueChange={setOrderBy}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Order By" />
        </SelectTrigger>
        <SelectContent>
          {orderByOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="col-span-full flex justify-end gap-2">
        <Button onClick={handleClear} variant="outline">
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
        <Button onClick={handleApply}>
          <Search className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
