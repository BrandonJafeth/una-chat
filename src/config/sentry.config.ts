import * as Sentry from '@sentry/react'

const SENTRY_DSN = 'https://aa4ece18f0bbc7bae8c183c4a2c9c40c@o4509973259157504.ingest.us.sentry.io/4510294704324608'

export const initializeSentry = (): void => {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    // Disable trace propagation to avoid CORS issues
    tracePropagationTargets: [],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    sendDefaultPii: true,
    environment: import.meta.env.MODE || 'development',
    enableLogs: true,
    beforeSend(event) {
      // Log when Sentry is about to send an event
      console.log('🔴 Sentry capturing event:', event)
      return event
    },
  })
  
  console.log('✅ Sentry initialized successfully')
}

export { Sentry }
