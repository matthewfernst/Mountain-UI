import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./assets/css/weather-icons-wind.min.css";
import "./assets/css/weather-icons.min.css";

import "./index.css";

const queryClient = new QueryClient();

const client = new ApolloClient({
  link: new HttpLink({ uri: "https://production.lynx-api.com/graphql" }),
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
