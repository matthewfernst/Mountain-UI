import React from "react";
import ReactDOM from "react-dom/client";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import App from "./components/App";

import "./assets/styles/globals.scss";
import "./assets/styles/weather-icons-wind.min.css";
import "./assets/styles/weather-icons.min.css";

const client = new ApolloClient({
    uri: "https://production.lynx-api.com/graphql",
    cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>
);
