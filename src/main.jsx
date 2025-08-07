import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { ViewProvider } from './contexts/ViewContext'
import { theme } from './theme'
import App from './App'
import './styles/design-tokens.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <ViewProvider>
        <App />
      </ViewProvider>
    </ThemeProvider>
  </BrowserRouter>
)