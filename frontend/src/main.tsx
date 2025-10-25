import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from './components/provider/theme-provider.tsx'

const client = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <BrowserRouter>
                <HelmetProvider>
                    <ApolloProvider client={client}>
                        <App />
                    </ApolloProvider>
                </HelmetProvider>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>,
)