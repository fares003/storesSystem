import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ContextProvider } from './contexts/ContextProvider.jsx'
import { LoginProvider } from './contexts/LoginContext.jsx'
import { ToastContainer } from 'react-toastify'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <ToastContainer/>
          <LoginProvider>
            <App />
          </LoginProvider>
    </ContextProvider>
  </StrictMode>,
)
