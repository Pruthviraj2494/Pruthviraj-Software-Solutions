import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import store from './store'
import { setAuthFromStorage } from './store/slices/authSlice'
import { SocketProvider } from './context/SocketContext'
import ReduxToasts from './components/ReduxToasts'
import ErrorBoundary from './components/ErrorBoundary'

store.dispatch(setAuthFromStorage())

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ReduxToasts />
      <SocketProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </SocketProvider>
    </Provider>
  </React.StrictMode>
)
