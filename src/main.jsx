import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ContextProvider } from './contexts/ContextProvider.jsx'
import { LoginProvider } from './contexts/LoginContext.jsx'
import { ToastContainer } from 'react-toastify'
import {PerformanceProvider} from "@/contexts/PerformanceContext"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <ToastContainer/>
        <PerformanceProvider>
          <LoginProvider>
            <App />
          </LoginProvider>
        </PerformanceProvider>
    </ContextProvider>
  </StrictMode>,
)
