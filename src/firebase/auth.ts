/**
 * Project Nehemiah — Firebase Auth Service Boundary
 * Abstracts Firebase Authentication behind domain-driven interface methods with safe fallback behavior.
 */

import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';
import { normalizeFirebaseError, OperationType } from './errors';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: string;
  emailVerified: boolean;
}

export interface AuthActionResult {
  user: User | null;
  authUser: AuthUser | null;
  error: string | null;
  fromFallback: boolean;
}

/**
 * Normalizes a Firebase User object into a clean AuthUser domain model.
 */
export function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    provider: user.providerData[0]?.providerId || 'google.com',
    emailVerified: user.emailVerified,
  };
}

/**
 * Checks if Firebase Authentication is active and initialized.
 */
export function isAuthAvailable(): boolean {
  return isFirebaseConfigured() && auth !== null;
}

/**
 * Maps Firebase Auth error codes to user-friendly messages.
 */
function getFriendlyAuthErrorMessage(errorCode: string, fallbackMsg: string): string {
  switch (errorCode) {
    case 'auth/popup-closed-by-user':
      return 'The Google sign-in window was closed before completing authentication. Please try again.';
    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked by your browser. Please allow popups for this site or open in a new browser tab.';
    case 'auth/cancelled-popup-request':
      return 'Previous sign-in request was cancelled. Please click sign-in again.';
    case 'auth/unauthorized-domain':
      return 'This web domain is not authorized in your Firebase Console under Authentication > Settings > Authorized Domains.';
    case 'auth/operation-not-allowed':
      return 'Google Sign-In is not enabled in your Firebase project. Please enable Google in Firebase Console > Authentication > Sign-in method.';
    case 'auth/network-request-failed':
      return 'Network communication failed. Please check your internet connection and try again.';
    case 'auth/user-disabled':
      return 'This user account has been disabled by an administrator.';
    default:
      return fallbackMsg || 'An authentication error occurred. Please try again.';
  }
}

/**
 * Initiates Google Sign-In using popup flow.
 */
export async function signInWithGoogle(): Promise<AuthActionResult> {
  if (!isAuthAvailable() || !auth) {
    return {
      user: null,
      authUser: null,
      error: 'Firebase Authentication is not configured yet. Local development preview mode is active.',
      fromFallback: true,
    };
  }

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const credential = await signInWithPopup(auth, provider);
    return {
      user: credential.user,
      authUser: toAuthUser(credential.user),
      error: null,
      fromFallback: false,
    };
  } catch (error) {
    const normalized = normalizeFirebaseError(error, OperationType.AUTH, 'auth/google-login');
    const friendlyMessage = getFriendlyAuthErrorMessage(normalized.code || '', normalized.error);
    return {
      user: null,
      authUser: null,
      error: friendlyMessage,
      fromFallback: false,
    };
  }
}

/**
 * Initiates Google Sign-In using redirect flow (useful for strict mobile pop-up blockers).
 */
export async function signInWithGoogleRedirect(): Promise<void> {
  if (!isAuthAvailable() || !auth) return;
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  await signInWithRedirect(auth, provider);
}

/**
 * Resolves authentication result following a redirect flow.
 */
export async function checkRedirectAuthResult(): Promise<AuthActionResult | null> {
  if (!isAuthAvailable() || !auth) return null;

  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      return {
        user: result.user,
        authUser: toAuthUser(result.user),
        error: null,
        fromFallback: false,
      };
    }
    return null;
  } catch (error) {
    const normalized = normalizeFirebaseError(error, OperationType.AUTH, 'auth/redirect-result');
    const friendlyMessage = getFriendlyAuthErrorMessage(normalized.code || '', normalized.error);
    return {
      user: null,
      authUser: null,
      error: friendlyMessage,
      fromFallback: false,
    };
  }
}

/**
 * Signs out the current authenticated Firebase user.
 */
export async function signOutUser(): Promise<{ success: boolean; error: string | null }> {
  if (!isAuthAvailable() || !auth) {
    return { success: true, error: null };
  }

  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    const normalized = normalizeFirebaseError(error, OperationType.AUTH, 'auth/sign-out');
    return { success: false, error: normalized.error };
  }
}

/**
 * Returns the currently signed-in Firebase user, or null.
 */
export function getCurrentAuthUser(): User | null {
  if (!isAuthAvailable() || !auth) {
    return null;
  }
  return auth.currentUser;
}

/**
 * Retrieves custom claims from the Firebase User's ID Token.
 */
export async function getUserTokenClaims(
  user: User,
  forceRefresh = false
): Promise<{ role: string | null; permissions?: string[]; claims: Record<string, unknown> }> {
  try {
    const tokenResult = await user.getIdTokenResult(forceRefresh);
    const claims = tokenResult.claims || {};
    const role = typeof claims.role === 'string' ? claims.role : null;
    const permissions = Array.isArray(claims.permissions)
      ? (claims.permissions as string[])
      : undefined;

    return { role, permissions, claims };
  } catch (error) {
    return { role: null, claims: {} };
  }
}

/**
 * Subscribes to Firebase Authentication state change events.
 */
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  if (!isAuthAvailable() || !auth) {
    // Unconfigured state fallback listener
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
