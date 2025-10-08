import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

/**
 * Movie Hooks
 *
 * These hooks use React Query to fetch movie data from your backend.
 * React Query handles caching, loading states, errors, and automatic
 * refetching for you.
 *
 * Usage in a component:
 * const { data, isLoading, error } = useTrendingMovies();
 *
 * React Query automatically:
 * - Caches the data so subsequent calls are instant
 * - Refetches when the data gets stale
 * - Handles loading and error states
 * - Deduplicates requests if multiple components need the same data
 */

/**
 * Get Trending Movies
 */
export const useTrendingMovies = (timeWindow: "day" | "week" = "week") => {
	return useQuery({
		queryKey: ["movies", "trending", timeWindow],
		queryFn: async () => {
			const { data } = await api.get(
				`/movies/trending?timeWindow=${timeWindow}`,
			);
			return data.data;
		},
		staleTime: 1_000 * 60 * 5, // Consider data fresh for 5 minutes
	});
};

/**
 * Get Popular Movies
 */
export const usePopularMovies = (page: number = 1) => {
	return useQuery({
		queryKey: ["movies", "popular", page],
		queryFn: async () => {
			const { data } = await api.get(`/movies/popular?page=${page}`);
			return data.data;
		},
		staleTime: 1_000 * 60 * 10, // Fresh for 10 minutes
	});
};

/**
 * Get Top Rated Movies
 */
export const useTopRatedMovies = (page: number = 1) => {
	return useQuery({
		queryKey: ["movies", "top-rated", page],
		queryFn: async () => {
			const { data } = await api.get(`/movies/top-rated?page=${page}`);
			return data.data;
		},
		staleTime: 1_000 * 60 * 10,
	});
};

/**
 * Get Now Playing Movies
 */
export const useNowPlayingMovies = (page: number = 1) => {
	return useQuery({
		queryKey: ["movies", "now-playing", page],
		queryFn: async () => {
			const { data } = await api.get(`/movies/now-playing?page=${page}`);
			return data.data;
		},
		staleTime: 1_000 * 60 * 3, // Fresh for 3 minutes (changes more frequently)
	});
};

/**
 * Get Upcoming Movies
 */
export const useUpcomingMovies = (page: number = 1) => {
	return useQuery({
		queryKey: ["movies", "upcoming", page],
		queryFn: async () => {
			const { data } = await api.get(`/movies/upcoming?page=${page}`);
			return data.data;
		},
		staleTime: 1_000 * 60 * 10,
	});
};

/**
 * Get Movie Details
 */
export const useMovieDetails = (movieId: number) => {
	return useQuery({
		queryKey: ["movie", movieId],
		queryFn: async () => {
			const { data } = await api.get(`/movies/${movieId}`);
			return data.data;
		},
		enabled: !!movieId, // Only run if movieId exists
		staleTime: 1_000 * 60 * 30, // Fresh for 30 minutes (rarely changes)
	});
};

/**
 * Get Movie Credits (Cast & Crew)
 */
export const useMovieCredits = (movieId: number) => {
	return useQuery({
		queryKey: ["movie", movieId, "credits"],
		queryFn: async () => {
			const { data } = await api.get(`/movies/${movieId}/credits`);
			return data.data;
		},
		enabled: !!movieId,
		staleTime: 1_000 * 60 * 30,
	});
};

/**
 * Get Movie Videos (Trailers)
 */
export const useMovieVideos = (movieId: number) => {
	return useQuery({
		queryKey: ["movie", movieId, "videos"],
		queryFn: async () => {
			const { data } = await api.get(`/movies/${movieId}/videos`);
			return data.data;
		},
		enabled: !!movieId,
		staleTime: 1_000 * 60 * 30,
	});
};

/**
 * Get Similar Movies
 */
export const useSimilarMovies = (movieId: number, page: number = 1) => {
	return useQuery({
		queryKey: ["movie", movieId, "similar", page],
		queryFn: async () => {
			const { data } = await api.get(`/movies/${movieId}/similar?page=${page}`);
			return data.data;
		},
		enabled: !!movieId,
		staleTime: 1_000 * 60 * 10,
	});
};

/**
 * Get Movie Recommendations
 */
export const useMovieRecommendations = (movieId: number, page: number = 1) => {
	return useQuery({
		queryKey: ["movie", movieId, "recommendations", page],
		queryFn: async () => {
			const { data } = await api.get(
				`/movies/${movieId}/recommendations?page=${page}`,
			);
			return data.data;
		},
		enabled: !!movieId,
		staleTime: 1_000 * 60 * 10,
	});
};

/**
 * Search Movies
 */
export const useSearchMovies = (query: string, page: number = 1) => {
	return useQuery({
		queryKey: ["movies", "search", query, page],
		queryFn: async () => {
			const { data } = await api.get(
				`/movies/search?query=${encodeURIComponent(query)}&page=${page}`,
			);
			return data.data;
		},
		enabled: query.length > 0, // Only search if there's a query
		staleTime: 1_000 * 60 * 5,
	});
};

/**
 * Discover Movies with Filters
 */
export const useDiscoverMovies = (filters: {
	with_genres?: string;
	year?: number;
	sort_by?: string;
	page?: number;
}) => {
	return useQuery({
		queryKey: ["movies", "discover", filters],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (filters.with_genres)
				params.append("with_genres", filters.with_genres);
			if (filters.year) params.append("year", filters.year.toString());
			if (filters.sort_by) params.append("sort_by", filters.sort_by);
			if (filters.page) params.append("page", filters.page.toString());

			const { data } = await api.get(`/movies/discover?${params.toString()}`);
			return data.data;
		},
		staleTime: 1_000 * 60 * 10,
	});
};

/**
 * Get Movie Genres
 */
export const useMovieGenres = () => {
	return useQuery({
		queryKey: ["movies", "genres"],
		queryFn: async () => {
			const { data } = await api.get("/movies/genres");
			return data.data;
		},
		staleTime: 1_000 * 60 * 60 * 24, // Fresh for 24 hours (almost never changes)
	});
};
