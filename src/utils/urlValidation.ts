/**
 * Project Nehemiah — URL Security & Video Link Governance Module
 * Enforces safe URI schemes and classifies external video and social media links.
 * Distinguishes embeddable media from external provider links requiring direct navigation.
 */

export interface ExternalUrlValidationResult {
  isValid: boolean;
  error?: string;
  isExternal: boolean;
}

export type ClassifiedVideoProvider = 'youtube' | 'vimeo' | 'facebook' | 'googledrive' | 'direct' | 'external' | 'none';

export interface ClassifiedVideoLink {
  isEmbeddable: boolean;
  embedUrl?: string;
  externalUrl?: string;
  provider: ClassifiedVideoProvider;
  providerLabel: string;
  isUnsafe: boolean;
  noticeMessage?: string;
}

/**
 * Validates external web URLs and relative links.
 * Rejects javascript:, vbscript:, data:, file:, ftp:, and blob: schemes to prevent XSS.
 */
export function validateExternalUrl(url: string | undefined | null): ExternalUrlValidationResult {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { isValid: false, isExternal: false, error: 'URL cannot be empty.' };
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
      isExternal: false,
      error: 'Unsafe URI scheme detected. Only standard HTTP(S) or relative paths are permitted.',
    };
  }

  const isHttp = lower.startsWith('http://') || lower.startsWith('https://');
  const isRelative = lower.startsWith('/') || lower.startsWith('./');

  if (!isHttp && !isRelative) {
    return {
      isValid: false,
      isExternal: false,
      error: 'URL must begin with http://, https://, /, or ./',
    };
  }

  return {
    isValid: true,
    isExternal: isHttp,
  };
}

/**
 * Classifies video and media links into embeddable players vs external provider links.
 * Respects provider security restrictions (e.g. Facebook, Google Drive auth controls).
 */
export function classifyVideoLink(
  url: string | undefined | null,
  suggestedProvider?: string
): ClassifiedVideoLink {
  const validation = validateExternalUrl(url);

  if (!validation.isValid || !url) {
    return {
      isEmbeddable: false,
      provider: 'none',
      providerLabel: 'None',
      isUnsafe: !validation.isValid && url ? true : false,
      noticeMessage: validation.error || 'No video URL provided.',
    };
  }

  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  // 1. YouTube
  if (lower.includes('youtube.com') || lower.includes('youtu.be') || suggestedProvider === 'youtube') {
    if (lower.includes('youtube.com/embed/')) {
      return {
        isEmbeddable: true,
        embedUrl: trimmed,
        externalUrl: trimmed,
        provider: 'youtube',
        providerLabel: 'YouTube',
        isUnsafe: false,
      };
    }
    let videoId = '';
    if (lower.includes('youtu.be/')) {
      videoId = trimmed.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0] || '';
    } else if (lower.includes('watch?v=')) {
      videoId = trimmed.split('v=')[1]?.split('&')[0] || '';
    } else {
      videoId = trimmed.split('/').pop()?.split('?')[0] || '';
    }

    if (videoId) {
      return {
        isEmbeddable: true,
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`,
        externalUrl: `https://www.youtube.com/watch?v=${videoId}`,
        provider: 'youtube',
        providerLabel: 'YouTube',
        isUnsafe: false,
      };
    }
  }

  // 2. Vimeo
  if (lower.includes('vimeo.com') || suggestedProvider === 'vimeo') {
    if (lower.includes('player.vimeo.com/video/')) {
      return {
        isEmbeddable: true,
        embedUrl: trimmed,
        externalUrl: trimmed,
        provider: 'vimeo',
        providerLabel: 'Vimeo',
        isUnsafe: false,
      };
    }
    const videoId = trimmed.split('/').pop()?.split('?')[0] || '';
    if (videoId && /^\d+$/.test(videoId)) {
      return {
        isEmbeddable: true,
        embedUrl: `https://player.vimeo.com/video/${videoId}`,
        externalUrl: `https://vimeo.com/${videoId}`,
        provider: 'vimeo',
        providerLabel: 'Vimeo',
        isUnsafe: false,
      };
    }
  }

  // 3. Facebook Video
  if (lower.includes('facebook.com') || lower.includes('fb.watch')) {
    return {
      isEmbeddable: false,
      externalUrl: trimmed,
      provider: 'facebook',
      providerLabel: 'Facebook Watch',
      isUnsafe: false,
      noticeMessage: 'Facebook video stream requires opening directly at Facebook to respect provider authentication and access policies.',
    };
  }

  // 4. Google Drive
  if (lower.includes('drive.google.com')) {
    return {
      isEmbeddable: false,
      externalUrl: trimmed,
      provider: 'googledrive',
      providerLabel: 'Google Drive',
      isUnsafe: false,
      noticeMessage: 'Google Drive media content requires visiting Google Drive directly to respect file permissions.',
    };
  }

  // 5. Direct MP4 / WebM
  if (lower.endsWith('.mp4') || lower.endsWith('.webm') || suggestedProvider === 'direct') {
    return {
      isEmbeddable: true,
      embedUrl: trimmed,
      externalUrl: trimmed,
      provider: 'direct',
      providerLabel: 'Direct Video File',
      isUnsafe: false,
    };
  }

  // 6. Generic external link
  return {
    isEmbeddable: false,
    externalUrl: trimmed,
    provider: 'external',
    providerLabel: 'External Provider',
    isUnsafe: false,
    noticeMessage: 'External media source must be opened directly in a new window.',
  };
}
