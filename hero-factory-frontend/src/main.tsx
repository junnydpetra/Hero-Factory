import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HeroProvider } from './context/HeroContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroProvider>
      <App />
    </HeroProvider>
  </React.StrictMode>,
)