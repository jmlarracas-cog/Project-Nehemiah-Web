/**
 * Project Nehemiah — Central Firebase Initialization
 * Safe initialization module with fallback support when environment variables are unconfigured.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getFirebaseConfigStatus, type FirebaseConfigStatus } from './config';

export const firebaseStatus: FirebaseConfigStatus = getFirebaseConfigStatus();

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

if (firebaseStatus.isConfigured && firebaseStatus.config) {
  try {
    const existingApps = getApps();
    appInstance = existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseStatus.config);
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
    storageInstance = getStorage(appInstance);

    if (import.meta.env.DEV) {
      console.log('✅ [Project Nehemiah] Firebase initialized successfully.');
    }
  } catch (error) {
    console.warn('⚠️ [Project Nehemiah] Firebase initialization deferred:', error);
  }
} else {
  if (import.meta.env.DEV) {
    console.info(`ℹ️ [Project Nehemiah] ${firebaseStatus.statusMessage}`);
  }
}

export const app: FirebaseApp | null = appInstance;
export const auth: Auth | null = authInstance;
export const db: Firestore | null = dbInstance;
export const storage: FirebaseStorage | null = storageInstance;

export function isFirebaseConfigured(): boolean {
  return firebaseStatus.isConfigured && appInstance !== null;
}
