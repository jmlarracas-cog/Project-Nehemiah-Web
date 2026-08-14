/**
 * Project Nehemiah — Repository Factory & Unified Data Gateway
 * Dynamically resolves Local vs Firestore repository instances based on runtime Firebase configuration.
 */

import { isFirestoreAvailable } from '../firebase/firestore';

import {
  LocalSermonRepository,
  LocalEventRepository,
  LocalMinistryRepository,
  LocalChurchRepository,
  LocalLeadershipRepository,
  LocalPageRepository,
  LocalSiteSettingsRepository,
  LocalNavigationRepository,
  LocalUserRepository,
  LocalGovernanceRepository,
  LocalMediaRepository,
} from './local';

import {
  FirestoreSermonRepository,
  FirestoreEventRepository,
  FirestoreMinistryRepository,
  FirestoreChurchRepository,
  FirestoreLeadershipRepository,
  FirestorePageRepository,
  FirestoreSiteSettingsRepository,
  FirestoreNavigationRepository,
  FirestoreUserRepository,
  FirestoreGovernanceRepository,
  FirestoreMediaRepository,
} from './firestore';

import type {
  ISermonRepository,
  IEventRepository,
  IMinistryRepository,
  IChurchRepository,
  ILeadershipRepository,
  IPageRepository,
  ISiteSettingsRepository,
  INavigationRepository,
  IUserRepository,
  IGovernanceRepository,
  IMediaRepository,
} from './types';

export * from './types';

// Cached singleton instances
let sermonRepo: ISermonRepository | null = null;
let eventRepo: IEventRepository | null = null;
let ministryRepo: IMinistryRepository | null = null;
let churchRepo: IChurchRepository | null = null;
let leadershipRepo: ILeadershipRepository | null = null;
let pageRepo: IPageRepository | null = null;
let siteSettingsRepo: ISiteSettingsRepository | null = null;
let navRepo: INavigationRepository | null = null;
let userRepo: IUserRepository | null = null;
let governanceRepo: IGovernanceRepository | null = null;
let mediaRepo: IMediaRepository | null = null;

/**
 * Determines whether to use Firestore or Local fallback based on configuration.
 * Preference is given to explicit VITE_DATA_SOURCE ('local' | 'firestore').
 */
export function useFirestore(): boolean {
  const dataSource = import.meta.env.VITE_DATA_SOURCE;

  if (dataSource === 'local') {
    return false;
  }

  if (dataSource === 'firestore') {
    if (!isFirestoreAvailable()) {
      const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';
      if (isProduction) {
        console.error(
          '[CRITICAL PRODUCTION CONFIGURATION ERROR] VITE_DATA_SOURCE="firestore" is set for production, but Firebase/Firestore is unconfigured. Application cannot silently display mock data in production mode.'
        );
        throw new Error(
          'Production Firestore Configuration Error: VITE_DATA_SOURCE="firestore" requested, but Firebase is not configured. Production builds must not silently serve mock data.'
        );
      }
      console.warn(
        '[Data Source Warning] VITE_DATA_SOURCE="firestore" was requested, but Firebase/Firestore is not configured. Falling back to local repositories.'
      );
      return false;
    }
    return true;
  }

  // Fallback when VITE_DATA_SOURCE is not explicitly specified
  if (import.meta.env.VITE_ENABLE_MOCK_ADMIN === 'true') {
    return false;
  }

  return isFirestoreAvailable();
}

export function getSermonRepository(): ISermonRepository {
  if (!sermonRepo) {
    sermonRepo = useFirestore() ? new FirestoreSermonRepository() : new LocalSermonRepository();
  }
  return sermonRepo;
}

export function getEventRepository(): IEventRepository {
  if (!eventRepo) {
    eventRepo = useFirestore() ? new FirestoreEventRepository() : new LocalEventRepository();
  }
  return eventRepo;
}

export function getMinistryRepository(): IMinistryRepository {
  if (!ministryRepo) {
    ministryRepo = useFirestore() ? new FirestoreMinistryRepository() : new LocalMinistryRepository();
  }
  return ministryRepo;
}

export function getChurchRepository(): IChurchRepository {
  if (!churchRepo) {
    churchRepo = useFirestore() ? new FirestoreChurchRepository() : new LocalChurchRepository();
  }
  return churchRepo;
}

export function getLeadershipRepository(): ILeadershipRepository {
  if (!leadershipRepo) {
    leadershipRepo = useFirestore() ? new FirestoreLeadershipRepository() : new LocalLeadershipRepository();
  }
  return leadershipRepo;
}

export function getPageRepository(): IPageRepository {
  if (!pageRepo) {
    pageRepo = useFirestore() ? new FirestorePageRepository() : new LocalPageRepository();
  }
  return pageRepo;
}

export function getSiteSettingsRepository(): ISiteSettingsRepository {
  if (!siteSettingsRepo) {
    siteSettingsRepo = useFirestore() ? new FirestoreSiteSettingsRepository() : new LocalSiteSettingsRepository();
  }
  return siteSettingsRepo;
}

export function getNavigationRepository(): INavigationRepository {
  if (!navRepo) {
    navRepo = useFirestore() ? new FirestoreNavigationRepository() : new LocalNavigationRepository();
  }
  return navRepo;
}

export function getUserRepository(): IUserRepository {
  if (!userRepo) {
    userRepo = useFirestore() ? new FirestoreUserRepository() : new LocalUserRepository();
  }
  return userRepo;
}

export function getGovernanceRepository(): IGovernanceRepository {
  if (!governanceRepo) {
    governanceRepo = useFirestore() ? new FirestoreGovernanceRepository() : new LocalGovernanceRepository();
  }
  return governanceRepo;
}

export function getMediaRepository(): IMediaRepository {
  if (!mediaRepo) {
    mediaRepo = useFirestore() ? new FirestoreMediaRepository() : new LocalMediaRepository();
  }
  return mediaRepo;
}
