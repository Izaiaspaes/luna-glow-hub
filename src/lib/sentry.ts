import * as Sentry from "@sentry/react";

// Sentry DSN - this is a public key, safe to include in client code
const SENTRY_DSN = "https://d2a7a98ec96a76342aab90835298cbe5@o4510483480248320.ingest.us.sentry.io/4510483489816576";

// Initialize Sentry for error monitoring
export function initSentry() {
  const isProduction = import.meta.env.MODE === "production";

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    
    // Performance monitoring - lower in production to save quota
    tracesSampleRate: isProduction ? 0.05 : 0.5, // 5% prod, 50% dev
    
    // Session replay - more aggressive in dev for debugging
    replaysSessionSampleRate: isProduction ? 0.05 : 0.3, // 5% prod, 30% dev
    replaysOnErrorSampleRate: isProduction ? 1.0 : 1.0,  // 100% on errors (both)
    
    // Only enable debug logging in development
    debug: !isProduction,
    
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
      
      // Java object errors (browser keyboard logging/extension interference)
      if (errorMessage.includes("Java object is gone") || 
          errorMessage.includes("enableDidUserTypeOnKeyboardLogging") ||
          errorMessage.includes("enableButtonsClickedMetaDataLogging") ||
          errorMessage.includes("invoking postMessage")) {
        return null;
      }
      
      // ServiceWorker errors (PWA/WebView compatibility issues)
      if (errorMessage.includes("ServiceWorker") || 
          errorMessage.includes("service worker") ||
          errorMessage.includes("dev-sw.js") ||
          (errorType === "InvalidStateError" && errorMessage.includes("document")) ||
          (errorType === "SecurityError" && errorMessage.includes("register"))) {
        return null;
      }
      
      // WebKit/iOS WebView message handler errors (iOS Safari PWA noise)
      if (errorMessage.includes("webkit.messageHandlers") || 
          errorMessage.includes("window.webkit")) {
        return null;
      }
      
      // replaceAll compatibility issues (older browsers/polyfill issues)
      if (errorMessage.includes("replaceAll is not a function")) {
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
