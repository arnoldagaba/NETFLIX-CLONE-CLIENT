import axios from "axios";
import { StatusCodes } from "http-status-codes";

/**
 * API Client
 *
 * This is your frontend's gateway to the backend. Think of it as a
 * specialized phone that only knows how to call your backend API.
 *
 * It automatically:
 * - Adds the correct base URL to every request
 * - Includes authentication tokens when available
 * - Handles common errors
 */

// Create axios instance with default configuration
const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 30_000, // 30 second timeout
});

/**
 * Request Interceptor
 *
 * This runs BEFORE every request is sent. We use it to attach
 * the authentication token if the user is logged in.
 *
 * The token is stored in a closure variable that we'll set from
 * our React components using Clerk's useAuth hook.
 */
let getTokenFunction: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (fn: () => Promise<string | null>) => {
	getTokenFunction = fn;
};

api.interceptors.request.use(
	async (config) => {
		// If we have a function to get the token, use it
		if (getTokenFunction) {
			try {
				const token = await getTokenFunction();
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
			} catch (error) {
				console.error("Failed to get auth token:", error);
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

/**
 * Response Interceptor
 *
 * This runs AFTER every response is received. We use it to handle
 * common errors in one place instead of in every component.
 */
api.interceptors.response.use(
	(response) => {
		// If the response is successful, just return it
		return response;
	},
	(error) => {
		// Handle common errors
		if (error.response) {
			// The server responded with an error status code
			const { status, data } = error.response;

			switch (status) {
				case StatusCodes.UNAUTHORIZED:
					// Unauthorized - token might be expired
					console.error("Unauthorized. Please log in again.");
					// You could redirect to login here if needed
					break;
				case StatusCodes.FORBIDDEN:
					console.error("Forbidden. You don't have permission.");
					break;
				case StatusCodes.NOT_FOUND:
					console.error("Resource not found.");
					break;
				case StatusCodes.CONFLICT:
					console.error("Too many requests. Please slow down.");
					break;
				case StatusCodes.INTERNAL_SERVER_ERROR:
					console.error("Server error. Please try again later.");
					break;
				default:
					console.error(`Error: ${data?.error || "Something went wrong"}`);
			}
		} else if (error.request) {
			// The request was made but no response was received
			console.error("No response from server. Check your connection.");
		} else {
			// Something else happened
			console.error("Request error:", error.message);
		}

		return Promise.reject(error);
	},
);

export default api;
