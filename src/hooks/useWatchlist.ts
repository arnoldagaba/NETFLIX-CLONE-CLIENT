import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "@/lib/api";

/**
 * Watchlist Hooks
 *
 * These hooks handle the user's personal watchlist.
 * They use mutations for create/delete operations which automatically
 * update the UI and refetch data when changes are made.
 */

/**
 * Get User's Watchlist
 */
export const useWatchlist = () => {
	return useQuery({
		queryKey: ["watchlist"],
		queryFn: async () => {
			const { data } = await api.get("/watchlist");
			return data.data;
		},
		// Don't cache as long since this is user-specific and changes frequently
		staleTime: 1000 * 60 * 2, // Fresh for 2 minutes
	});
};

/**
 * Add to Watchlist
 *
 * This is a mutation - it changes data on the server.
 * When successful, it automatically refetches the watchlist.
 */
export const useAddToWatchlist = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (item: {
			tmdbId: number;
			contentType: "movie" | "tv";
			title: string;
			posterPath?: string;
			note?: string;
		}) => {
			const { data } = await api.post("/watchlist", item);
			return data;
		},
		onSuccess: () => {
			// Invalidate and refetch watchlist
			queryClient.invalidateQueries({ queryKey: ["watchlist"] });
			toast.success("Added to watchlist!");
		},
		// biome-ignore lint/suspicious/noExplicitAny: Error type is not known
		onError: (error: any) => {
			const message =
				error.response?.data?.error || "Failed to add to watchlist";
			toast.error(message);
		},
	});
};

/**
 * Remove from Watchlist
 */
export const useRemoveFromWatchlist = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (watchlistId: string) => {
			const { data } = await api.delete(`/watchlist/${watchlistId}`);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["watchlist"] });
			toast.success("Removed from watchlist");
		},
		// biome-ignore lint/suspicious/noExplicitAny: Error type is not known
		onError: (error: any) => {
			const message =
				error.response?.data?.error || "Failed to remove from watchlist";
			toast.error(message);
		},
	});
};

/**
 * Check if Item is in Watchlist
 *
 * Useful for showing/hiding the "Add to Watchlist" button
 */
export const useWatchlistStatus = (
	tmdbId: number,
	contentType: "movie" | "tv",
) => {
	return useQuery({
		queryKey: ["watchlist", "status", tmdbId, contentType],
		queryFn: async () => {
			const { data } = await api.get(
				`/watchlist/check?tmdbId=${tmdbId}&contentType=${contentType}`,
			);
			return data;
		},
		enabled: !!tmdbId && !!contentType,
		staleTime: 1000 * 60 * 2,
	});
};
