import { PrayerRequestSubmission } from '../types/prayer';
import { getPrayerSubmissionRepository } from '../repositories/private';

export interface PrayerSubmissionResult {
  success: boolean;
  message: string;
  referenceId?: string;
}

/**
 * Service boundary for prayer request submissions.
 * Connects to private Firestore repository or local fallback adapter.
 *
 * PRIVACY & SECURITY RULES ENFORCED:
 * 1. Submission content is NEVER written to console logs, URLs, or analytics.
 * 2. Does not expose raw Firebase error traces to the client.
 * 3. Does not permit client-side read or list access to prayer requests.
 */
export async function submitPrayerRequest(
  submission: PrayerRequestSubmission
): Promise<PrayerSubmissionResult> {
  const requestText = submission.request?.trim() || '';

  if (requestText.length < 10) {
    return {
      success: false,
      message: 'Prayer request content must be at least 10 characters long.',
    };
  }

  if (requestText.length > 3000) {
    return {
      success: false,
      message: 'Prayer request content exceeds the 3,000 character limit.',
    };
  }

  if (!submission.consent) {
    return {
      success: false,
      message: 'You must acknowledge the submission consent to proceed.',
    };
  }

  try {
    const repository = getPrayerSubmissionRepository();
    const result = await repository.submit(submission);
    return {
      success: result.success,
      message: result.message || `Prayer request received. Reference: ${result.referenceId}`,
      referenceId: result.referenceId,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Unable to submit prayer request. Please check your connection and try again.',
    };
  }
}

