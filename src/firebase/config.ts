/**
 * Project Nehemiah — Firebase Environment Configuration & Validator
 * Validates Vite environment variables and provides development-safe status.
 */

import type { FirebaseOptions } from 'firebase/app';

export interface FirebaseConfigStatus {
  isConfigured: boolean;
  missingKeys: string[];
  config: FirebaseOptions | null;
  statusMessage: string;
}

/**
 * Retrieves and validates Firebase Web SDK options from Vite environment variables.
 * Safe for development: returns fallback status if keys are absent without crashing the site.
 */
export function getFirebaseConfigStatus(): FirebaseConfigStatus {
  const env = import.meta.env;

  const apiKey = env.VITE_FIREBASE_API_KEY;
  const authDomain = env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  const storageBucket = env.VITE_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const appId = env.VITE_FIREBASE_APP_ID;
  const measurementId = env.VITE_FIREBASE_MEASUREMENT_ID;

  const missingKeys: string[] = [];

  if (!apiKey) missingKeys.push('VITE_FIREBASE_API_KEY');
  if (!authDomain) missingKeys.push('VITE_FIREBASE_AUTH_DOMAIN');
  if (!projectId) missingKeys.push('VITE_FIREBASE_PROJECT_ID');
  if (!storageBucket) missingKeys.push('VITE_FIREBASE_STORAGE_BUCKET');
  if (!messagingSenderId) missingKeys.push('VITE_FIREBASE_MESSAGING_SENDER_ID');
  if (!appId) missingKeys.push('VITE_FIREBASE_APP_ID');

  const isConfigured = missingKeys.length === 0;

  if (!isConfigured) {
    return {
      isConfigured: false,
      missingKeys,
      config: null,
      statusMessage: 'Firebase backend not configured — local demo data active.',
    };
  }

  const config: FirebaseOptions = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    ...(measurementId ? { measurementId } : {}),
  };

  return {
    isConfigured: true,
    missingKeys: [],
    config,
    statusMessage: 'Firebase backend initialized successfully.',
  };
}
