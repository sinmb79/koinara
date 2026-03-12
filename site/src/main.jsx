import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0c1220',
            color: '#e8f0ff',
            border: '1px solid rgba(0,255,180,0.25)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#00ffb4', secondary: '#050810' } },
          error: { iconTheme: { primary: '#ff4466', secondary: '#050810' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
