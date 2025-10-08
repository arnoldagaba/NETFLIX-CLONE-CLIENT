import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from "@clerk/clerk-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { Movie } from "@/types";
import {
	usePopularMovies,
	useTopRatedMovies,
	useTrendingMovies,
} from "../hooks/useMovies";

/**
 * Homepage Component
 *
 * This is your Netflix-style homepage with rows of movies.
 * It demonstrates how to use your custom hooks to fetch data.
 */

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	// Fetch different categories of movies using our custom hooks
	const { data: trendingMovies, isLoading: trendingLoading } =
		useTrendingMovies();
	const { data: popularMovies, isLoading: popularLoading } = usePopularMovies();
	const { data: topRatedMovies, isLoading: topRatedLoading } =
		useTopRatedMovies();

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Navigation Bar */}
			<nav className="fixed top-0 z-50 w-full bg-gradient-to-b from-black to-transparent p-4">
				<div className="container mx-auto flex items-center justify-between">
					<div className="flex items-center gap-8">
						<h1 className="text-3xl font-bold text-red-600">NETFLIX CLONE</h1>
						<Link to="/" className="text-white hover:text-gray-300">
							Home
						</Link>

						<SignedIn>
							<Link to="/watchlist" className="text-white hover:text-gray-300">
								My List
							</Link>
						</SignedIn>
					</div>

					<div className="flex items-center gap-4">
						{/* Show different UI based on auth status */}
						<SignedOut>
							<SignInButton mode="modal">
								<button
									type="button"
									className="rounded bg-red-600 px-6 py-2 font-semibold hover:bg-red-700"
								>
									Sign In
								</button>
							</SignInButton>
						</SignedOut>

						<SignedIn>
							<UserButton afterSignOutUrl="/" />
						</SignedIn>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="pt-20">
				{/* Hero Section - Featured Movie */}
				<div className="relative h-[80vh] w-full">
					<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

					<div className="absolute bottom-0 left-0 p-8">
						<h2 className="mb-4 text-5xl font-bold">
							Welcome to Netflix Clone
						</h2>

						<p className="mb-6 max-w-md text-lg">
							Unlimited movies, TV shows, and more. Watch anywhere. Cancel
							anytime.
						</p>

						<div className="flex gap-4">
							<button
								type="button"
								className="rounded bg-white px-8 py-3 font-bold text-black hover:bg-gray-200"
							>
								▶ Play
							</button>

							<button
								type="button"
								className="rounded bg-gray-500/70 px-8 py-3 font-bold hover:bg-gray-500"
							>
								ℹ More Info
							</button>
						</div>
					</div>
				</div>

				{/* Movie Rows */}
				<div className="space-y-8 px-8 pb-20">
					{/* Trending Now */}
					<MovieRow
						title="Trending Now"
						movies={trendingMovies?.results || []}
						isLoading={trendingLoading}
					/>

					{/* Popular */}
					<MovieRow
						title="Popular on Netflix"
						movies={popularMovies?.results || []}
						isLoading={popularLoading}
					/>

					{/* Top Rated */}
					<MovieRow
						title="Top Rated"
						movies={topRatedMovies?.results || []}
						isLoading={topRatedLoading}
					/>
				</div>
			</main>
		</div>
	);
}

/**
 * MovieRow Component
 *
 * A horizontal scrolling row of movie posters
 */
interface MovieRowProps {
	title: string;
	movies: Movie[];
	isLoading: boolean;
}

function MovieRow({ title, movies, isLoading }: MovieRowProps) {
	if (isLoading) {
		return (
			<div className="space-y-2">
				<h2 className="text-2xl font-bold">{title}</h2>

				<div className="flex gap-2 overflow-x-auto">
					{[...Array(10)].map((_, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: It's just a placeholder
							key={i}
							className="h-36 w-64 animate-pulse rounded bg-gray-800"
						/>
					))}
				</div>
			</div>
		);
	}

	if (!movies.length) {
		return null;
	}

	return (
		<div className="space-y-2">
			<h2 className="text-2xl font-bold">{title}</h2>

			<div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
				{movies.map((movie) => (
					<MovieCard key={movie.id} movie={movie} />
				))}
			</div>
		</div>
	);
}

/**
 * MovieCard Component
 *
 * A single movie poster card with hover effects
 */
interface MovieCardProps {
	movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
	const imageUrl = movie.poster_path
		? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
		: "https://via.placeholder.com/342x513?text=No+Image";

	return (
		<Link
			to="/movie/$id"
			params={{ id: movie.id.toString() }}
			className="group relative w-64 flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
		>
			<img
				src={imageUrl}
				alt={movie.title}
				className="h-36 w-full rounded object-cover"
			/>

			{/* Hover overlay with info */}
			<div className="absolute inset-0 flex flex-col justify-end rounded bg-gradient-to-t from-black to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
				<h3 className="font-bold">{movie.title}</h3>

				<div className="flex items-center gap-2 text-sm">
					<span className="text-green-500">
						★ {movie.vote_average.toFixed(1)}
					</span>

					<span>{movie.release_date?.split("-")[0]}</span>
				</div>
			</div>
		</Link>
	);
}
