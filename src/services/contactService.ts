import { getContactInquiryRepository } from '../repositories/private';

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
  consent: boolean;
}

export interface ContactSubmissionResult {
  success: boolean;
  referenceId?: string;
  error?: string;
}

/**
 * Service boundary for contact form & visit inquiries.
 * ENFORCES PRIVACY & SECURITY:
 * 1. Submission payload is never printed to client-side logs or exposed in URL parameters.
 * 2. Input validation strictly enforced on client before processing.
 * 3. Returns a unique reference ID for user confirmation.
 */
export async function submitContactInquiry(
  payload: ContactSubmissionPayload
): Promise<ContactSubmissionResult> {
  // 1. Client-side input validation
  const name = payload.name?.trim();
  if (!name || name.length < 2) {
    return { success: false, error: 'Please provide your full name (minimum 2 characters).' };
  }

  const email = payload.email?.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  const message = payload.message?.trim();
  if (!message || message.length < 10) {
    return { success: false, error: 'Please enter a message with at least 10 characters.' };
  }

  if (message.length > 2000) {
    return { success: false, error: 'Message exceeds the 2,000 character limit.' };
  }

  if (!payload.consent) {
    return { success: false, error: 'Please accept the consent terms to submit your inquiry.' };
  }

  try {
    const repository = getContactInquiryRepository();
    const result = await repository.submit(payload);
    return result;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred while submitting your message. Please try again later.',
    };
  }
}

