/**
 * Project Nehemiah — Firebase App Check Readiness Module
 * Prepares architecture for future App Check initialization (reCAPTCHA Enterprise / v3 or debug tokens)
 * without requiring live production credentials during development.
 *
 * CRITICAL ARCHITECTURAL DISTINCTION:
 * - App Check Client Initialization: Prepares the browser client to request App Check tokens.
 * - Product-Side Enforcement: Must be explicitly enabled in the Firebase Console for Firestore/Storage.
 * Client initialization does NOT automatically enforce App Check on backend database traffic until product-side
 * enforcement is activated in Firebase Console security settings.
 *
 * App Check complements Firestore Security Rules and NEVER replaces authentication or authorization.
 */

import { initializeAppCheck, ReCaptchaEnterpriseProvider, type AppCheck } from 'firebase/app-check';
import { app } from './firebase';

let appCheckInstance: AppCheck | null = null;

export interface AppCheckStatus {
  isActivated: boolean;
  provider: 'recaptcha-enterprise' | 'debug' | 'none';
  statusMessage: string;
}

/**
 * Initializes App Check if site key / debug token environment variables are configured.
 * Safely defers initialization if credentials are absent without crashing the site.
 */
export function initAppCheck(): AppCheckStatus {
  if (!app) {
    return {
      isActivated: false,
      provider: 'none',
      statusMessage: 'App Check deferred: Firebase app instance is not initialized.',
    };
  }

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  // Debug token setup is strictly guarded to local development mode (import.meta.env.DEV).
  // Production builds (import.meta.env.PROD) will NEVER execute debug token logic.
  if (import.meta.env.DEV) {
    const debugToken = import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN;
    if (debugToken) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken === 'true' ? true : debugToken;
    }
  }

  if (siteKey) {
    try {
      appCheckInstance = initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
      return {
        isActivated: true,
        provider: 'recaptcha-enterprise',
        statusMessage: 'Firebase App Check initialized with reCAPTCHA Enterprise provider.',
      };
    } catch (error) {
      return {
        isActivated: false,
        provider: 'none',
        statusMessage: `App Check initialization deferred: ${(error as Error).message}`,
      };
    }
  }

  return {
    isActivated: false,
    provider: 'none',
    statusMessage: 'App Check deferred: VITE_RECAPTCHA_SITE_KEY not configured in environment.',
  };
}

export function getAppCheck(): AppCheck | null {
  return appCheckInstance;
}
