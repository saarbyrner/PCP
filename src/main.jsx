import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ViewProvider } from './contexts/ViewContext'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ViewProvider>
      <App />
    </ViewProvider>
  </BrowserRouter>
)