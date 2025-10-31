import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from '@/components/provider/theme-provider.tsx'
import TransitionLayout from '@/components/provider/transition-layout.tsx'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

const client = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <TransitionLayout>
                <BrowserRouter>
                    <HelmetProvider>
                        <ApolloProvider client={client}>
                            <App />
                        </ApolloProvider>
                    </HelmetProvider>
                </BrowserRouter>
            </TransitionLayout>
        </ThemeProvider>
    </React.StrictMode>,
)