// Import required libraries and components
import React from 'react' // React library for building user interfaces
import ReactDOM from 'react-dom/client' // React DOM for rendering components
import App from './App.tsx' // Main application component
import './index.css' // Global styles and Tailwind CSS
import { ClerkProvider } from '@clerk/clerk-react'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

// Render the main App component to the DOM
ReactDOM.createRoot(document.getElementById('root')!).render( // Creates React root and renders app
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
