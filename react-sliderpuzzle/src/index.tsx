import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";

const queryClient = new QueryClient();

const container = document.getElementById("root");

if (container) {
	const root = ReactDOM.createRoot(container);
	root.render(
		<React.StrictMode>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</React.StrictMode>
	);
} else {
	console.error("Failed to find the root element.");
}
