import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Set the base URL for all axios requests.
// In production (Vercel), VITE_API_URL = your Render backend URL.
// In development, it's empty so Vite's proxy to localhost:5000 kicks in.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
