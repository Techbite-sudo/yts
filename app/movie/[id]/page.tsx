import Image from "next/image"
import { getMovieDetails, getMovieSuggestions, type Torrent } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Download, PlayCircle, LinkIcon } from "lucide-react"
import { MovieCard } from "@/components/movie-card"
import { Separator } from "@/components/ui/separator"

interface MovieDetailsPageProps {
  params: {
    id: string
  }
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const movieId = Number.parseInt(params.id)

  if (isNaN(movieId)) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Invalid Movie ID.</div>
  }

  const movie = await getMovieDetails({ movie_id: movieId, with_images: true, with_cast: true })
  const suggestions = await getMovieSuggestions({ movie_id: movieId })

  if (!movie) {
    return <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">Movie not found.</div>
  }

  const formatRuntime = (minutes: number) => {
    if (minutes <= 0) return "N/A"
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const constructMagnetLink = (torrent: Torrent, movieTitle: string) => {
    const encodedMovieName = encodeURIComponent(movieTitle.replace(/\s/g, "."))
    const trackers = [
      "udp://open.demonii.com:1337/announce",
      "udp://tracker.openbittorrent.com:80",
      "udp://tracker.coppersurfer.tk:6969",
      "udp://glotorrents.pw:6969/announce",
      "udp://tracker.opentrackr.org:1337/announce",
      "udp://torrent.gresille.org:80/announce",
      "udp://p4p.arenabg.com:1337",
      "udp://tracker.leechers-paradise.org:6969",
      "udp://p4p.arenabg.ch:1337",
      "udp://tracker.internetwarriors.net:1337",
    ]
      .map((tr) => `&tr=${encodeURIComponent(tr)}`)
      .join("")

    return `magnet:?xt=urn:btih:${torrent.hash}&dn=${encodedMovieName}+${torrent.quality}${trackers}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex justify-center">
          <Image
            src={movie.large_cover_image || "/placeholder.svg?height=450&width=300&query=movie poster large"}
            alt={movie.title_english}
            width={300}
            height={450}
            className="rounded-lg shadow-xl object-cover w-full max-w-[300px] md:max-w-full"
            priority
          />
        </div>
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-2">{movie.title_english}</h1>
          <p className="text-xl text-muted-foreground mb-4">
            {movie.year} &bull; {movie.mpa_rating || "N/A"}
          </p>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-lg font-semibold">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>{movie.rating.toFixed(1)} / 10</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-lg font-semibold">{formatRuntime(movie.runtime)}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genres?.map((genre) => (
              <Badge key={genre} variant="secondary" className="text-base px-3 py-1">
                {genre}
              </Badge>
            ))}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {movie.description_full || movie.summary || "No description available."}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {movie.yt_trailer_code && (
              <Button asChild>
                <a
                  href={`https://www.youtube.com/watch?v=${movie.yt_trailer_code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Watch Trailer
                </a>
              </Button>
            )}
            {movie.torrents && movie.torrents.length > 0 && (
              <Button asChild variant="outline">
                <a
                  href={constructMagnetLink(movie.torrents[0], movie.title_english)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download ({movie.torrents[0].quality})
                </a>
              </Button>
            )}
            {movie.url && (
              <Button asChild variant="ghost">
                <a href={movie.url} target="_blank" rel="noopener noreferrer">
                  <LinkIcon className="h-5 w-5 mr-2" />
                  View on YTS
                </a>
              </Button>
            )}
          </div>

          {movie.torrents && movie.torrents.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Available Torrents</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {movie.torrents.map((torrent) => (
                  <Card key={torrent.hash}>
                    <CardContent className="p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">{torrent.quality}</span>
                        <Badge variant="outline">{torrent.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span>Size: {torrent.size}</span> &bull; <span>Seeds: {torrent.seeds}</span> &bull;{" "}
                        <span>Peers: {torrent.peers}</span>
                      </div>
                      <Button asChild size="sm">
                        <a
                          href={constructMagnetLink(torrent, movie.title_english)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {movie.cast && movie.cast.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movie.cast.map((member) => (
                  <Card key={member.imdb_code} className="flex flex-col items-center text-center">
                    <CardContent className="p-3">
                      <Image
                        src={member.url_small_image || "/placeholder.svg?height=100&width=100&query=actor photo"}
                        alt={member.name}
                        width={100}
                        height={100}
                        className="rounded-full object-cover w-24 h-24 mb-2"
                      />
                      <p className="font-semibold text-sm line-clamp-1">{member.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{member.character_name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-center">More Like This</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {suggestions.map((suggestedMovie) => (
              <MovieCard key={suggestedMovie.id} movie={suggestedMovie} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
