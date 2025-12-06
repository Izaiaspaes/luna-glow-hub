/**
 * Safe Service Worker Registration
 * Handles environments where SW registration is not supported (e.g., WebViews)
 */

export const registerServiceWorker = async (): Promise<void> => {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported in this browser');
    return;
  }

  // Detect WebView environments where SW might fail
  const isWebView = detectWebView();
  if (isWebView) {
    console.log('WebView detected - skipping Service Worker registration');
    return;
  }

  // Check if document is in a valid state for SW registration
  if (document.readyState === 'loading') {
    // Wait for DOM to be ready
    await new Promise<void>((resolve) => {
      document.addEventListener('DOMContentLoaded', () => resolve());
    });
  }

  try {
    // Additional check for document state
    if (!document.body) {
      console.warn('Document body not available - deferring SW registration');
      return;
    }

    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('Service Worker registered successfully:', registration.scope);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New Service Worker available');
          }
        });
      }
    });
  } catch (error) {
    // Silently handle InvalidStateError in WebViews
    if (error instanceof Error) {
      if (error.name === 'InvalidStateError' || error.message.includes('invalid state')) {
        console.log('SW registration skipped: document in invalid state (likely WebView)');
        return;
      }
      // Log other errors but don't crash the app
      console.warn('Service Worker registration failed:', error.message);
    }
  }
};

/**
 * Detect if running inside a WebView
 */
function detectWebView(): boolean {
  const userAgent = navigator.userAgent || '';
  
  // Check for common WebView indicators
  const webViewIndicators = [
    // Android WebView
    /\bwv\b/.test(userAgent),
    /; wv\)/.test(userAgent),
    // Facebook/Instagram/Twitter in-app browsers
    /FBAN|FBAV|Instagram|Twitter/i.test(userAgent),
    // Chrome WebView (not Chrome browser)
    /Chrome\/[.0-9]* Mobile/.test(userAgent) && /Version\/[.0-9]* Chrome/.test(userAgent),
    // iOS WebView
    /\(iPhone.*CPU.*OS/.test(userAgent) && !/Safari/.test(userAgent),
    // Android in-app browser without full SW support
    /Android.*Version\/[0-9]/.test(userAgent) && !/Chrome\/[0-9]/.test(userAgent),
  ];

  return webViewIndicators.some(Boolean);
}

/**
 * Check if SW is ready and working
 */
export const isServiceWorkerReady = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    return !!registration.active;
  } catch {
    return false;
  }
};
