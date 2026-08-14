export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Project Nehemiah — Asset URL Security Policy
 * Enforces safe URI schemes for media asset URLs and relative paths.
 * Rejects javascript:, vbscript:, data:, file:, ftp:, blob: to prevent XSS/injection attacks.
 */
export function validateAssetUrl(url: string | undefined | null): UrlValidationResult {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { isValid: false, error: 'Asset URL or relative path cannot be empty.' };
  }

  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  // Reject unsafe protocol schemes and embedded scripts
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:') ||
    lower.startsWith('ftp:') ||
    lower.startsWith('blob:') ||
    lower.includes('javascript:')
  ) {
    return {
      isValid: false,
      error: 'Invalid or unsafe URI scheme detected. Only standard http(s) or relative local asset paths (e.g. /images/...) are permitted.',
    };
  }

  // Must begin with http://, https://, /, or ./
  if (
    !lower.startsWith('http://') &&
    !lower.startsWith('https://') &&
    !lower.startsWith('/') &&
    !lower.startsWith('./')
  ) {
    return {
      isValid: false,
      error: 'Asset URL must begin with http://, https://, or a relative path starting with / or ./',
    };
  }

  return { isValid: true };
}
