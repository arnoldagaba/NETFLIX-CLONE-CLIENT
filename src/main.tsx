import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";

import { setTokenGetter } from "./lib/api";
import { routeTree } from "./routeTree.gen";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

/**
 * Main Entry Point
 *
 * This is where everything starts. We wrap our entire app with providers
 * that give it superpowers:
 * - ClerkProvider: Authentication
 * - QueryClientProvider: Data fetching and caching
 * - RouterProvider: Navigation
 */

// Get Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
	throw new Error("Missing Clerk Publishable Key");
}

// Create React Query client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1, // Retry failed requests once
			refetchOnWindowFocus: false, // Don't refetch when window gains focus
			staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes by default
		},
	},
});

// Create TanStack Router instance
const router = createRouter({
	routeTree,
	context: {
		queryClient,
		// biome-ignore lint/style/noNonNullAssertion: We are sure that it's defined
		auth: undefined!, // This will be provided by the app
	},
	defaultPreload: "intent", // Preload routes when user hovers over link
	defaultPreloadStaleTime: 10_000,
});

// Register router for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

/**
 * Inner App Component
 *
 * This component is inside ClerkProvider so it can use Clerk hooks.
 * It sets up the token getter for our API client.
 */
function InnerApp() {
	const { getToken, isLoaded, isSignedIn } = useAuth();

	// Set up token getter for API client
	React.useEffect(() => {
		setTokenGetter(async () => {
			return await getToken();
		});
	}, [getToken]);

	// Provide auth context to router
	const auth = React.useMemo(
		() => ({
			isLoaded,
			isSignedIn: isSignedIn ?? false,
		}),
		[isLoaded, isSignedIn],
	);

	return (
		<RouterProvider
			router={router}
			context={{
				queryClient,
				auth,
			}}
		/>
	);
}

/**
 * Root App Component
 *
 * Wraps everything with all the providers
 */
function App() {
	return (
		<ClerkProvider publishableKey={clerkPubKey} afterSignOutUrl="/">
			<QueryClientProvider client={queryClient}>
				<InnerApp />

				{/* Toast notifications for user feedback */}
				<ToastContainer
					position="top-right"
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="dark"
				/>

				{/* React Query Devtools - only shows in development */}
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</ClerkProvider>
	);
}

// Render the app
// biome-ignore lint/style/noNonNullAssertion: Ignore
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
