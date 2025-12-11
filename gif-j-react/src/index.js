import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Provider } from "react-redux";
import { store } from "./store";
import { captchaKey } from "./static/captchaKey";

import "./index.css";

// Trigger test deployment
// Global error handler to catch all errors
window.addEventListener('error', (event) => {
  console.error('🚨 GLOBAL ERROR:', event.error);
  console.error('🚨 Error message:', event.message);
  console.error('🚨 Error stack:', event.error?.stack);
  console.error('🚨 Error filename:', event.filename);
  console.error('🚨 Error lineno:', event.lineno);
  
  // Store in sessionStorage
  try {
    const errors = JSON.parse(sessionStorage.getItem('globalErrors') || '[]');
    errors.push({
      message: event.message,
      error: event.error?.message,
      stack: event.error?.stack,
      filename: event.filename,
      lineno: event.lineno,
      timestamp: new Date().toISOString()
    });
    sessionStorage.setItem('globalErrors', JSON.stringify(errors.slice(-10))); // Keep last 10
  } catch (e) {
    console.error('Failed to store global error:', e);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 UNHANDLED PROMISE REJECTION:', event.reason);
  console.error('🚨 Reason:', event.reason);
  
  // Store in sessionStorage
  try {
    const errors = JSON.parse(sessionStorage.getItem('globalErrors') || '[]');
    errors.push({
      type: 'unhandledrejection',
      reason: event.reason?.toString(),
      stack: event.reason?.stack,
      timestamp: new Date().toISOString()
    });
    sessionStorage.setItem('globalErrors', JSON.stringify(errors.slice(-10)));
  } catch (e) {
    console.error('Failed to store unhandled rejection:', e);
  }
});

// Log any stored errors on page load
try {
  const lastError = sessionStorage.getItem('lastLoginError');
  if (lastError) {
    console.error('📋 LAST LOGIN ERROR (from storage):', JSON.parse(lastError));
  }
  
  const globalErrors = sessionStorage.getItem('globalErrors');
  if (globalErrors) {
    console.error('📋 GLOBAL ERRORS (from storage):', JSON.parse(globalErrors));
  }
} catch (e) {
  console.error('Failed to read stored errors:', e);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <GoogleReCaptchaProvider reCaptchaKey={captchaKey}>
      <App />
    </GoogleReCaptchaProvider>
  </Provider>
);

reportWebVitals();
