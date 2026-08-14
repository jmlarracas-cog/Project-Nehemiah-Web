/**
 * Project Nehemiah — Central Application Authentication Context
 * Manages Firebase authentication state, Google sign-in flows, loading resolution,
 * and development mock admin session toggles.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import {
  isAuthAvailable,
  onAuthStateChange,
  signInWithGoogle as firebaseSignInWithGoogle,
  signInWithGoogleRedirect as firebaseSignInWithGoogleRedirect,
  checkRedirectAuthResult,
  signOutUser as firebaseSignOutUser,
  toAuthUser,
  type AuthUser,
} from '../firebase/auth';

export type AuthorizationStatus = 'none' | 'pending' | 'authorized' | 'rejected';

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAuthorized: boolean;
  authorizationStatus: AuthorizationStatus;
  authAvailable: boolean;
  isMockAdmin: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<boolean>;
  signInWithGoogleRedirect: () => Promise<void>;
  signOut: () => Promise<void>;
  enableMockAdminSession: () => void;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Environment flag check for development mock mode support
const isMockAdminAllowedByEnv = import.meta.env.VITE_ENABLE_MOCK_ADMIN === 'true' || import.meta.env.DEV;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMockAdmin, setIsMockAdmin] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authorizationStatus, setAuthorizationStatus] = useState<AuthorizationStatus>('none');

  const authAvailable = isAuthAvailable();

  useEffect(() => {
    let unsubscribe = () => {};

    // 1. Check for mobile redirect sign-in result first
    if (authAvailable) {
      checkRedirectAuthResult()
        .then((res) => {
          if (res && res.authUser) {
            setUser(res.authUser);
            setAuthorizationStatus('pending'); // Authenticated, but Stage 6C role assignment pending
          }
        })
        .catch(() => {})
        .finally(() => {
          // 2. Subscribe to auth state changes
          unsubscribe = onAuthStateChange((fbUser: User | null) => {
            if (fbUser) {
              setUser(toAuthUser(fbUser));
              setAuthorizationStatus('pending'); // Authenticated; Stage 6C will resolve roles from Firestore
              setIsMockAdmin(false);
            } else {
              setUser(null);
              setAuthorizationStatus('none');
            }
            setLoading(false);
          });
        });
    } else {
      // Firebase auth not configured in environment
      setLoading(false);
    }

    return () => unsubscribe();
  }, [authAvailable]);

  // Derived authorization determination
  // Note: For Stage 6B, authenticated Google users have authorizationStatus = 'pending'.
  // Mock Admin mode grants development authorization (isAuthorized = true) strictly for dev preview testing.
  const isAuthenticated = user !== null || isMockAdmin;
  const isAuthorized = isMockAdmin; // In Stage 6B, only mock mode or future 6C role mapper grants isAuthorized

  const signInWithGoogle = async (): Promise<boolean> => {
    setAuthError(null);
    if (!authAvailable) {
      setAuthError('Firebase Authentication is not configured for this environment.');
      return false;
    }

    const result = await firebaseSignInWithGoogle();
    if (result.error) {
      setAuthError(result.error);
      return false;
    }

    if (result.authUser) {
      setUser(result.authUser);
      setAuthorizationStatus('pending');
      setIsMockAdmin(false);
      return true;
    }

    return false;
  };

  const signInWithGoogleRedirect = async (): Promise<void> => {
    setAuthError(null);
    if (!authAvailable) {
      setAuthError('Firebase Authentication is not configured for this environment.');
      return;
    }
    await firebaseSignInWithGoogleRedirect();
  };

  const signOut = async (): Promise<void> => {
    setAuthError(null);
    await firebaseSignOutUser();
    setUser(null);
    setIsMockAdmin(false);
    setAuthorizationStatus('none');
  };

  const enableMockAdminSession = (): void => {
    if (!isMockAdminAllowedByEnv) {
      setAuthError('Mock Admin mode is disabled in production.');
      return;
    }
    setIsMockAdmin(true);
    setAuthorizationStatus('authorized');
    setUser({
      uid: 'dev-mock-admin-001',
      email: 'admin.demo@subiccog.org',
      displayName: 'System Super Admin [Demo]',
      photoURL: null,
      provider: 'mock-provider',
      emailVerified: true,
    });
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAuthorized,
        authorizationStatus,
        authAvailable,
        isMockAdmin,
        authError,
        signInWithGoogle,
        signInWithGoogleRedirect,
        signOut,
        enableMockAdminSession,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
