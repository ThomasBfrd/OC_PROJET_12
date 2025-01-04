import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.tsx'
import { store } from "./app/core/store.ts"
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')!).render(

    <Provider store={store}>
      <App />
    </Provider>

)
