/**
 * Project Nehemiah — Firebase Storage Service Boundary
 * Prepares Firebase Storage asset management interfaces with safe local fallback.
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, isFirebaseConfigured } from './firebase';
import { normalizeFirebaseError, OperationType } from './errors';
import { STORAGE_FOLDERS, type StorageFolder, type FirebaseAdapterResult } from './types';

/**
 * Checks if Firebase Storage service is initialized.
 */
export function isStorageAvailable(): boolean {
  return isFirebaseConfigured() && storage !== null;
}

/**
 * Uploads a media asset file to Firebase Storage under a categorized folder.
 */
export async function uploadAsset(
  folder: StorageFolder,
  fileName: string,
  file: Blob
): Promise<FirebaseAdapterResult<string>> {
  if (!isStorageAvailable() || !storage) {
    return {
      data: null,
      error: 'Firebase Storage is not configured yet. Local placeholder asset mode active.',
      fromFallback: true,
    };
  }

  try {
    const storageRef = ref(storage, `${folder}/${fileName}`);
    const uploadSnap = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(uploadSnap.ref);

    return {
      data: downloadUrl,
      error: null,
      fromFallback: false,
    };
  } catch (error) {
    const normalized = normalizeFirebaseError(error, OperationType.STORAGE, `${folder}/${fileName}`);
    return {
      data: null,
      error: normalized.error,
      fromFallback: false,
    };
  }
}

/**
 * Deletes a media asset from Firebase Storage.
 */
export async function deleteAsset(storagePath: string): Promise<FirebaseAdapterResult<boolean>> {
  if (!isStorageAvailable() || !storage) {
    return {
      data: false,
      error: 'Firebase Storage is not configured yet.',
      fromFallback: true,
    };
  }

  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);

    return {
      data: true,
      error: null,
      fromFallback: false,
    };
  } catch (error) {
    const normalized = normalizeFirebaseError(error, OperationType.DELETE, storagePath);
    return {
      data: false,
      error: normalized.error,
      fromFallback: false,
    };
  }
}
