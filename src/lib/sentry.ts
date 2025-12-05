import * as Sentry from "@sentry/react";

// Initialize Sentry for error monitoring
// DSN should be set in production - get it from sentry.io dashboard
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!dsn) {
    console.warn("Sentry DSN not configured. Error monitoring disabled.");
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    
    // Performance monitoring
    tracesSampleRate: 0.1, // 10% of transactions
    
    // Session replay for debugging
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Filter out non-critical errors
    beforeSend(event) {
      // Ignore ResizeObserver errors (common browser noise)
      if (event.exception?.values?.[0]?.value?.includes("ResizeObserver")) {
        return null;
      }
      return event;
    },
    
    // Integrations
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}

// Helper to capture custom errors with context
export function captureError(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

// Helper to set user context (call after login)
export function setUserContext(userId: string, email?: string) {
  Sentry.setUser({
    id: userId,
    email,
  });
}

// Helper to clear user context (call after logout)
export function clearUserContext() {
  Sentry.setUser(null);
}

// Export Sentry for direct use
export { Sentry };
