import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { Actor, Genre, Movie } from "@/types";
import {
	useMovieCredits,
	useMovieDetails,
	useSimilarMovies,
} from "../hooks/useMovies";
import {
	useAddToWatchlist,
	useRemoveFromWatchlist,
	useWatchlistStatus,
} from "../hooks/useWatchlist";

/**
 * Movie Detail Page
 *
 * Shows complete information about a specific movie including:
 * - Large backdrop image
 * - Title, description, runtime, rating
 * - Cast information
 * - Similar movies
 * - Add to watchlist functionality
 */

export const Route = createFileRoute("/movie/$id")({
	component: MovieDetailPage,
});

function MovieDetailPage() {
	const { id } = Route.useParams();
	const movieId = parseInt(id, 10);

	// Fetch movie data
	const { data: movie, isLoading } = useMovieDetails(movieId);
	const { data: credits } = useMovieCredits(movieId);
	const { data: similarMovies } = useSimilarMovies(movieId);

	// Watchlist functionality
	const { data: watchlistStatus } = useWatchlistStatus(movieId, "movie");
	const addToWatchlist = useAddToWatchlist();
	const removeFromWatchlist = useRemoveFromWatchlist();
	const { isSignedIn } = useUser();

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-black">
				<div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-red-600"></div>
			</div>
		);
	}

	if (!movie) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-black">
				<div className="text-center">
					<h1 className="mb-4 text-4xl font-bold text-white">
						Movie Not Found
					</h1>

					<Link to="/" className="text-red-600 hover:underline">
						Go back home
					</Link>
				</div>
			</div>
		);
	}

	const backdropUrl = movie.backdrop_path
		? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
		: null;

	const posterUrl = movie.poster_path
		? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
		: null;

	const handleWatchlistToggle = () => {
		if (!isSignedIn) {
			alert("Please sign in to add movies to your watchlist");
			return;
		}

		if (watchlistStatus?.inWatchlist) {
			// Remove from watchlist
			removeFromWatchlist.mutate(watchlistStatus.data.id);
		} else {
			// Add to watchlist
			addToWatchlist.mutate({
				tmdbId: movie.id,
				contentType: "movie",
				title: movie.title,
				posterPath: movie.poster_path,
			});
		}
	};

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Back Button */}
			<Link
				to="/"
				className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70"
			>
				←
			</Link>

			{/* Hero Section with Backdrop */}
			<div className="relative h-[80vh] w-full">
				{backdropUrl && (
					<img
						src={backdropUrl}
						alt={movie.title}
						className="h-full w-full object-cover"
					/>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

				{/* Movie Info Overlay */}
				<div className="absolute bottom-0 left-0 right-0 p-8">
					<div className="container mx-auto flex gap-8">
						{/* Poster */}
						{posterUrl && (
							<img
								src={posterUrl}
								alt={movie.title}
								className="hidden h-96 rounded-lg shadow-2xl md:block"
							/>
						)}

						{/* Details */}
						<div className="flex-1">
							<h1 className="mb-4 text-5xl font-bold">{movie.title}</h1>

							{/* Metadata */}
							<div className="mb-4 flex flex-wrap items-center gap-4 text-lg">
								<span className="text-green-500">
									★ {movie.vote_average.toFixed(1)}
								</span>

								<span>{movie.release_date?.split("-")[0]}</span>

								{movie.runtime && <span>{movie.runtime} min</span>}
								{movie.genres && (
									<div className="flex gap-2">
										{movie.genres.slice(0, 3).map((genre: Genre) => (
											<span
												key={genre.id}
												className="rounded-full bg-gray-700 px-3 py-1 text-sm"
											>
												{genre.name}
											</span>
										))}
									</div>
								)}
							</div>

							{/* Tagline */}
							{movie.tagline && (
								<p className="mb-4 text-xl italic text-gray-300">
									"{movie.tagline}"
								</p>
							)}

							{/* Overview */}
							<p className="mb-6 max-w-3xl text-lg">{movie.overview}</p>

							{/* Action Buttons */}
							<div className="flex gap-4">
								<button
									type="button"
									className="flex items-center gap-2 rounded bg-white px-8 py-3 font-bold text-black hover:bg-gray-200"
								>
									<span>▶</span> Play
								</button>

								<SignedIn>
									<button
										type="button"
										onClick={handleWatchlistToggle}
										disabled={
											addToWatchlist.isPending || removeFromWatchlist.isPending
										}
										className="flex items-center gap-2 rounded bg-gray-700/70 px-8 py-3 font-bold hover:bg-gray-700 disabled:opacity-50"
									>
										{watchlistStatus?.inWatchlist ? (
											<>
												<span>✓</span> In Watchlist
											</>
										) : (
											<>
												<span>+</span> Add to Watchlist
											</>
										)}
									</button>
								</SignedIn>

								<SignedOut>
									<button
										type="button"
										onClick={() => alert("Please sign in to use watchlist")}
										className="flex items-center gap-2 rounded bg-gray-700/70 px-8 py-3 font-bold hover:bg-gray-700"
									>
										<span>+</span> Add to Watchlist
									</button>
								</SignedOut>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Cast Section */}
			{credits?.cast && credits.cast.length > 0 && (
				<div className="container mx-auto px-8 py-12">
					<h2 className="mb-6 text-3xl font-bold">Cast</h2>

					<div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
						{credits.cast.slice(0, 10).map((actor: Actor) => (
							<div key={actor.id} className="w-32 flex-shrink-0">
								{actor.profile_path ? (
									<img
										src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
										alt={actor.name}
										className="mb-2 h-48 w-full rounded object-cover"
									/>
								) : (
									<div className="mb-2 flex h-48 w-full items-center justify-center rounded bg-gray-800">
										<span className="text-4xl">👤</span>
									</div>
								)}
								<p className="font-semibold">{actor.name}</p>
								<p className="text-sm text-gray-400">{actor.birthday}</p>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Similar Movies Section */}
			{similarMovies?.results && similarMovies.results.length > 0 && (
				<div className="container mx-auto px-8 pb-20">
					<h2 className="mb-6 text-3xl font-bold">More Like This</h2>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
						{similarMovies.results.slice(0, 10).map((movie: Movie) => (
							<Link
								key={movie.id}
								to="/movie/$id"
								params={{ id: movie.id.toString() }}
								className="group cursor-pointer"
							>
								<div className="relative overflow-hidden rounded-lg">
									<img
										src={
											movie.poster_path
												? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
												: "https://via.placeholder.com/342x513?text=No+Image"
										}
										alt={movie.title}
										className="h-full w-full object-cover transition-transform group-hover:scale-105"
									/>

									<div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 transition-opacity group-hover:opacity-100">
										<div className="absolute bottom-0 p-4">
											<p className="font-bold">{movie.title}</p>

											<p className="text-sm text-gray-300">
												★ {movie.vote_average.toFixed(1)}
											</p>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
