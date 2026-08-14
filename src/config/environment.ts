/**
 * Project Nehemiah — Environment Classification & Runtime Mode
 * 
 * Centralized runtime environment resolution.
 * Distinguishes between:
 * - 'development': Local developer sandbox
 * - 'preview': Controlled Leadership Preview Mode (default for preview builds)
 * - 'production': Official production deployment
 */

export type AppEnvironment = 'development' | 'preview' | 'production';

export function getAppEnvironment(): AppEnvironment {
  const envVar = import.meta.env.VITE_APP_ENV;
  if (envVar === 'preview') return 'preview';
  if (envVar === 'production') return 'production';
  if (envVar === 'development') return 'development';

  // Fallback heuristic:
  // If explicitly in DEV mode without VITE_APP_ENV override, return 'development'
  if (import.meta.env.DEV) {
    return 'development';
  }

  // Default fallback for pre-launch preview builds: 'preview'
  return 'preview';
}

/**
 * Returns true if the application is running in Leadership Preview mode or Development mode.
 */
export function isLeadershipPreview(): boolean {
  const env = getAppEnvironment();
  return env === 'preview' || env === 'development';
}

/**
 * Returns true if the application is running in explicit Production mode.
 */
export function isProductionEnvironment(): boolean {
  return getAppEnvironment() === 'production';
}

/**
 * Returns true if running in local development mode.
 */
export function isDevelopmentEnvironment(): boolean {
  return getAppEnvironment() === 'development';
}
