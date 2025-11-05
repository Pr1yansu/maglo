import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/provider/theme-provider.tsx";
import TransitionLayout from "@/components/provider/transition-layout.tsx";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { apolloClient } from "@/lib/apollo-client";
import { store } from "@/store/store";
import { hydrateSession } from "@/store/auth/auth-slice";

store.dispatch(hydrateSession());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TransitionLayout>
        <BrowserRouter>
          <HelmetProvider>
            <ApolloProvider client={apolloClient}>
              <Provider store={store}>
                <App />
              </Provider>
            </ApolloProvider>
          </HelmetProvider>
        </BrowserRouter>
      </TransitionLayout>
    </ThemeProvider>
  </React.StrictMode>
);
