import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tv/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/tv/$id"!</div>;
}
