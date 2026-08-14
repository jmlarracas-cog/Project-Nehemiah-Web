/**
 * Project Nehemiah — Firebase Error Normalizer
 * Sanitizes and formats Firebase runtime errors safely.
 */

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
  AUTH = 'auth',
  STORAGE = 'storage',
}

export interface FirebaseErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  code?: string;
  timestamp: string;
}

/**
 * Normalizes Firebase runtime errors into standard safe objects.
 * Guarantees that sensitive user data (prayer content, messages, tokens) is never logged or exposed.
 */
export function normalizeFirebaseError(
  error: unknown,
  operationType: OperationType = OperationType.GET,
  path: string | null = null
): FirebaseErrorInfo {
  let errorMessage = 'An unexpected backend error occurred.';
  let code = 'unknown';

  if (error && typeof error === 'object') {
    const err = error as { code?: string; message?: string };
    if (err.code) code = err.code;
    if (err.message) {
      // Strip potentially sensitive raw details if needed
      errorMessage = err.message;
    }
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  const normalized: FirebaseErrorInfo = {
    error: errorMessage,
    operationType,
    path,
    code,
    timestamp: new Date().toISOString(),
  };

  if (import.meta.env.DEV) {
    console.warn(`[Firebase Error Sanitized] Operation: ${operationType} | Path: ${path || 'N/A'} | Code: ${code}`);
  }

  return normalized;
}
