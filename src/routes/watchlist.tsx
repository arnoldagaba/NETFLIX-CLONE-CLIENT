import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from "@clerk/clerk-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useRemoveFromWatchlist, useWatchlist } from "../hooks/useWatchlist";

/**
 * Watchlist Page
 *
 * Shows all movies and TV shows the user has saved to watch later.
 * This is a protected page - users must be signed in to see it.
 */

export const Route = createFileRoute("/watchlist")({
	component: WatchlistPage,
});

function WatchlistPage() {
	const { data: watchlist, isLoading } = useWatchlist();
	const removeFromWatchlist = useRemoveFromWatchlist();

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Navigation */}
			<nav className="border-b border-gray-800 bg-black p-4">
				<div className="container mx-auto flex items-center justify-between">
					<div className="flex items-center gap-8">
						<Link to="/" className="text-3xl font-bold text-red-600">
							NETFLIX CLONE
						</Link>

						<Link to="/" className="text-gray-300 hover:text-white">
							Home
						</Link>

						<Link to="/watchlist" className="font-semibold text-white">
							My List
						</Link>
					</div>

					<div className="flex items-center gap-4">
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
			<main className="container mx-auto px-8 py-12">
				<SignedOut>
					<div className="flex min-h-[60vh] flex-col items-center justify-center">
						<h1 className="mb-4 text-4xl font-bold">
							Sign In to See Your Watchlist
						</h1>

						<p className="mb-8 text-gray-400">
							Save movies and TV shows to watch later
						</p>

						<SignInButton mode="modal">
							<button
								type="button"
								className="rounded bg-red-600 px-8 py-3 font-semibold hover:bg-red-700"
							>
								Sign In
							</button>
						</SignInButton>
					</div>
				</SignedOut>

				<SignedIn>
					<h1 className="mb-8 text-4xl font-bold">My Watchlist</h1>

					{isLoading ? (
						<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
							{[...Array(10)].map((_, i) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: Ignore in placeholders
									key={i}
									className="h-72 animate-pulse rounded-lg bg-gray-800"
								/>
							))}
						</div>
					) : !watchlist || watchlist.length === 0 ? (
						<div className="flex min-h-[50vh] flex-col items-center justify-center">
							<div className="mb-4 text-6xl">📝</div>

							<h2 className="mb-2 text-2xl font-bold">
								Your watchlist is empty
							</h2>

							<p className="mb-6 text-gray-400">
								Add movies and TV shows to watch later
							</p>

							<Link
								to="/"
								className="rounded bg-red-600 px-8 py-3 font-semibold hover:bg-red-700"
							>
								Browse Content
							</Link>
						</div>
					) : (
						<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
							{watchlist.map((item: any) => (
								<div key={item.id} className="group relative">
									<Link
										to={item.contentType === "movie" ? "/movie/$id" : "/tv/$id"}
										params={{ id: item.tmdbId.toString() }}
										className="block"
									>
										<div className="relative overflow-hidden rounded-lg">
											<img
												src={
													item.posterPath
														? `https://image.tmdb.org/t/p/w342${item.posterPath}`
														: "https://via.placeholder.com/342x513?text=No+Image"
												}
												alt={item.title}
												className="h-full w-full object-cover transition-transform group-hover:scale-105"
											/>

											<div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 transition-opacity group-hover:opacity-100">
												<div className="absolute bottom-0 p-4">
													<p className="font-bold">{item.title}</p>

													<p className="text-sm text-gray-300">
														{item.contentType === "movie" ? "Movie" : "TV Show"}
													</p>
												</div>
											</div>
										</div>
									</Link>

									{/* Remove Button */}
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											if (window.confirm("Remove from watchlist?")) {
												removeFromWatchlist.mutate(item.id);
											}
										}}
										disabled={removeFromWatchlist.isPending}
										className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity hover:bg-black group-hover:opacity-100 disabled:opacity-50"
										title="Remove from watchlist"
									>
										✕
									</button>

									{/* Optional Note */}
									{item.note && (
										<div className="mt-2 rounded bg-gray-800 p-2 text-sm text-gray-400">
											{item.note}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</SignedIn>
			</main>
		</div>
	);
}
