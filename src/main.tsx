import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import { initSentry } from "./lib/sentry";
import { registerServiceWorker } from "./lib/registerSW";

// Initialize Sentry error monitoring
initSentry();

// Register Service Worker with safe fallback for WebViews
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
