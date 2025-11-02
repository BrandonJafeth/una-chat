import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.tsx'
import { 
  AUTH0_DOMAIN, 
  AUTH0_CLIENT_ID, 
  AUTH0_AUDIENCE, 
  AUTH0_REDIRECT_URI 
} from './utils/constants'
import { initializeSentry } from './config/sentry.config'

// Initialize Sentry as early as possible
initializeSentry()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: AUTH0_REDIRECT_URI,
        audience: AUTH0_AUDIENCE,
      }}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)
