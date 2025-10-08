import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

/**
 * Root Route Layout
 *
 * This is the top-level route that wraps all other routes.
 * It provides the main layout structure and context for your app.
 */

interface RouterContext {
	queryClient: QueryClient;
	auth: {
		isLoaded: boolean;
		isSignedIn: boolean;
	};
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			{/* Outlet renders the current route's component */}
			<Outlet />

			{/* Router DevTools - only shows in development */}
			{import.meta.env.DEV && (
				<TanStackRouterDevtools position="bottom-right" />
			)}
		</>
	);
}
