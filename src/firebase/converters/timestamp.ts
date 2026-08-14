/**
 * Project Nehemiah — Firestore Timestamp Serialization Utilities
 * Normalizes Firestore Timestamps, Dates, and ISO strings for domain models.
 */

import { Timestamp, serverTimestamp } from 'firebase/firestore';

/**
 * Normalizes any timestamp representation (Firestore Timestamp, Date, ISO string, or number)
 * into a ISO 8601 string representation for UI domain models.
 */
export function normalizeTimestamp(value: unknown, fallbackIso: string = new Date().toISOString()): string {
  if (!value) return fallbackIso;

  // Firestore Timestamp object
  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  // JS Date instance
  if (value instanceof Date) {
    return value.toISOString();
  }

  // ISO string or date string
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
    return value;
  }

  // Unix epoch number
  if (typeof value === 'number') {
    return new Date(value).toISOString();
  }

  return fallbackIso;
}

/**
 * Formats an ISO string to a clean YYYY-MM-DD date string.
 */
export function formatIsoToDateString(isoString: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toISOString().split('T')[0];
  } catch {
    return isoString;
  }
}

/**
 * Converts a string or Date to a Firestore Timestamp for database writes.
 */
export function toFirestoreTimestamp(value: string | Date | undefined): Timestamp | ReturnType<typeof serverTimestamp> {
  if (!value) {
    return serverTimestamp();
  }
  if (value instanceof Date) {
    return Timestamp.fromDate(value);
  }
  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) {
    return Timestamp.fromDate(parsed);
  }
  return serverTimestamp();
}
