import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Dev only: expose the storage layer as `battledex` for testing from the browser console.
if (import.meta.env.DEV) {
  import('./lib/storage.js').then((storage) => {
    window.battledex = storage
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
