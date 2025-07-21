import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import type { Movie } from "@/lib/api"

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`} className="group block">
      <Card className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-lg">
          <Image
            src={movie.medium_cover_image || "/placeholder.svg?height=300&width=200&query=movie poster"}
            alt={movie.title_english}
            width={200}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            priority={true} // Prioritize loading for initial view
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-3">
            <div className="flex flex-wrap gap-1">
              {movie.genres?.slice(0, 2).map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="text-md font-semibold line-clamp-2 min-h-[40px]">{movie.title_english}</h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
            <span>{movie.year}</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
