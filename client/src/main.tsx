import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'

const rootElement = document.getElementById('root');
if(!rootElement) throw new Error('Element not found')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
