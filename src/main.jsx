import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
// --- 1. Import TanStack Query client and provider ---
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import App from './App.jsx'
import './index.css'

// This will now correctly read from C:\LegAIntel\.env
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// --- 2. Create a client instance for TanStack Query ---
// This object will manage all of your application's data caching.
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* The BrowserRouter is required for all routing to work */}
    <BrowserRouter>
      {/* --- 3. Wrap the app in the QueryClientProvider --- */}
      {/* This makes data fetching and caching available everywhere. */}
      <QueryClientProvider client={queryClient}>
        {/* The GoogleOAuthProvider makes the Client ID available to the app */}
        <GoogleOAuthProvider clientId={googleClientId}>
          {/* The AuthProvider manages user login state */}
          <AuthProvider>
            <App />
          </AuthProvider>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)