/**
 * Project Nehemiah — Firestore Database Service Boundary
 * Abstracts Firestore operations behind domain-safe interfaces.
 * 
 * SECURITY BOUNDARY ARCHITECTURE:
 * - UI / Repository Guard = Application safety boundary (prevents accidental public UI reads)
 * - Firestore Security Rules = Actual client database authorization boundary (Stage 6E)
 * - Trusted Firebase Admin SDK/backend = Privileged server boundary
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { normalizeFirebaseError, OperationType } from './errors';
import { FIRESTORE_COLLECTIONS, type FirestoreCollectionName, type FirebaseAdapterResult } from './types';

/**
 * Checks if Firestore database connection is active.
 */
export function isFirestoreAvailable(): boolean {
  return isFirebaseConfigured() && db !== null;
}

/**
 * Asserts that private collections (prayer_requests, contact_inquiries) are never queried via generic public helper functions.
 * Note: This client-side guard is an application safety boundary to prevent accidental UI reads.
 * Actual client database access control is enforced by Firestore Security Rules (Stage 6E).
 */
function isPrivateCollection(collectionName: string): boolean {
  return (
    collectionName === FIRESTORE_COLLECTIONS.PRAYER_REQUESTS ||
    collectionName === FIRESTORE_COLLECTIONS.CONTACT_INQUIRIES
  );
}

/**
 * Retrieves all documents from a Firestore collection with error handling and fallback support.
 */
export async function getCollectionDocs<T = DocumentData>(
  collectionName: FirestoreCollectionName
): Promise<FirebaseAdapterResult<T[]>> {
  if (isPrivateCollection(collectionName)) {
    console.warn(`[Private Data Boundary Enforced] Direct public read prohibited for collection '${collectionName}'.`);
    return {
      data: null,
      error: `Access Denied: '${collectionName}' is a private collection and requires elevated administrative permissions.`,
      fromFallback: true,
    };
  }

  if (!isFirestoreAvailable() || !db) {
    return {
      data: null,
      error: 'Firestore is not configured. Local demo data active.',
      fromFallback: true,
    };
  }

  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as unknown as T[];

    return {
      data: items,
      error: null,
      fromFallback: false,
    };
  } catch (error) {
    const normalized = normalizeFirebaseError(error, OperationType.LIST, collectionName);
    return {
      data: null,
      error: normalized.error,
      fromFallback: false,
    };
  }
}

/**
 * Fetches a single document by ID from a Firestore collection.
 */
export async function getDocById<T = DocumentData>(
  collectionName: FirestoreCollectionName,
  docId: string
): Promise<FirebaseAdapterResult<T>> {
  if (!isFirestoreAvailable() || !db) {
    return {
      data: null,
      error: 'Firestore is not configured. Local demo data active.',
      fromFallback: true,
    };
  }

  try {
    const docRef = doc(db, collectionName, docId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return {
        data: null,
        error: `Document '${docId}' not found in '${collectionName}'.`,
        fromFallback: false,
      };
    }

    return {
      data: { id: snap.id, ...snap.data() } as unknown as T,
      error: null,
      fromFallback: false,
    };
  } catch (error) {
    const normalized = normalizeFirebaseError(error, OperationType.GET, `${collectionName}/${docId}`);
    return {
      data: null,
      error: normalized.error,
      fromFallback: false,
    };
  }
}

/**
 * Writes or updates a document in a Firestore collection with strict error normalization.
 */
export async function setDocById<T extends Record<string, unknown>>(
  collectionName: FirestoreCollectionName,
  docId: string,
  data: T
): Promise<FirebaseAdapterResult<boolean>> {
  if (!isFirestoreAvailable() || !db) {
    return {
      data: false,
      error: 'Firestore is not configured. Operates in local demo mode.',
      fromFallback: true,
    };
  }

  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return {
      data: true,
      error: null,
      fromFallback: false,
    };
  } catch (error) {
    const normalized = normalizeFirebaseError(error, OperationType.WRITE, `${collectionName}/${docId}`);
    return {
      data: false,
      error: normalized.error,
      fromFallback: false,
    };
  }
}

/**
 * Creates a new document in a Firestore collection with an auto-generated ID.
 */
export async function addDocToCollection<T extends Record<string, unknown>>(
  collectionName: FirestoreCollectionName,
  data: T
): Promise<FirebaseAdapterResult<string>> {
  if (!isFirestoreAvailable() || !db) {
    return {
      data: null,
      error: 'Firestore is not configured. Operates in local demo mode.',
      fromFallback: true,
    };
  }

  try {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return {
      data: docRef.id,
      error: null,
      fromFallback: false,
    };
  } catch (error) {
    const normalized = normalizeFirebaseError(error, OperationType.CREATE, collectionName);
    return {
      data: null,
      error: normalized.error,
      fromFallback: false,
    };
  }
}

/**
 * Deletes a document from a Firestore collection.
 */
export async function deleteDocById(
  collectionName: FirestoreCollectionName,
  docId: string
): Promise<FirebaseAdapterResult<boolean>> {
  if (!isFirestoreAvailable() || !db) {
    return {
      data: false,
      error: 'Firestore is not configured. Operates in local demo mode.',
      fromFallback: true,
    };
  }

  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);

    return {
      data: true,
      error: null,
      fromFallback: false,
    };
  } catch (error) {
    const normalized = normalizeFirebaseError(error, OperationType.DELETE, `${collectionName}/${docId}`);
    return {
      data: false,
      error: normalized.error,
      fromFallback: false,
    };
  }
}
