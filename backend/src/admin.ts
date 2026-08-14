/**
 * Project Nehemiah — Firebase Admin SDK Initialization
 * Isolated initialization for trusted backend operations.
 * Uses Application Default Credentials (ADC) or process.env configuration.
 *
 * SAFETY DIRECTIVES:
 * - NEVER embed or commit service account JSON files.
 * - NEVER expose this initialization module to the Vite frontend (`/src`).
 */

import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

export function getAdminApp(): App {
  if (!adminApp) {
    if (getApps().length > 0) {
      adminApp = getApps()[0];
    } else {
      // Initialize with Application Default Credentials
      adminApp = initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCP_PROJECT,
      });
    }
  }
  return adminApp;
}

export function getAdminAuth(): Auth {
  if (!adminAuth) {
    adminAuth = getAuth(getAdminApp());
  }
  return adminAuth;
}

export function getAdminDb(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp());
  }
  return adminDb;
}
