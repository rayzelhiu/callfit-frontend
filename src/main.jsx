import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />

  <Toaster 
      position="top-center"
      toastOptions={{
        duration: 2500,
        style: {
          fontSize: "14px",
          padding: "12px 18px",
          borderRadius: "12px",
        },
      }}
    />

  </StrictMode>,
)
