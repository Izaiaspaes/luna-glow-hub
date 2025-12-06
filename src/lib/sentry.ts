import * as Sentry from "@sentry/react";

// Sentry DSN - this is a public key, safe to include in client code
const SENTRY_DSN = "https://d2a7a98ec96a76342aab90835298cbe5@o4510483480248320.ingest.us.sentry.io/4510483489816576";

// Initialize Sentry for error monitoring
export function initSentry() {

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    
    // Performance monitoring
    tracesSampleRate: 0.1, // 10% of transactions
    
    // Session replay for debugging
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Filter out non-critical errors (browser noise, not app bugs)
    beforeSend(event) {
      const errorMessage = event.exception?.values?.[0]?.value || "";
      const errorType = event.exception?.values?.[0]?.type || "";
      
      // === BROWSER NOISE FILTERS ===
      
      // ResizeObserver errors (browser layout calculation noise)
      if (errorMessage.includes("ResizeObserver")) {
        return null;
      }
      
      // CSSStyleSheet SecurityError (Sentry replay cross-origin noise)
      if (errorMessage.includes("CSSStyleSheet") || 
          (errorType === "SecurityError" && errorMessage.includes("stylesheet"))) {
        return null;
      }
      
      // Script errors from cross-origin scripts (no useful info)
      if (errorMessage === "Script error." || errorMessage === "Script error") {
        return null;
      }
      
      // ChunkLoadError from code-splitting during deployments
      if (errorType === "ChunkLoadError" || errorMessage.includes("Loading chunk")) {
        return null;
      }
      
      // Browser extension interference (common patterns)
      if (errorMessage.includes("extension") || 
          errorMessage.includes("chrome-extension://") ||
          errorMessage.includes("moz-extension://")) {
        return null;
      }
      
      // === KEEP ALL OTHER ERRORS (app bugs, API errors, etc.) ===
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
