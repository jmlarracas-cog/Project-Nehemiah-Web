import React, { useState } from 'react';
import {
  Send,
  User,
  Mail,
  Lock,
  Phone,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Shield,
  Heart,
  Info,
} from 'lucide-react';
import { PrayerCategory, PrayerVisibility, PrayerRequestSubmission } from '../../types/prayer';
import { submitPrayerRequest, PrayerSubmissionResult } from '../../services/prayerService';
import { Button } from '../ui/Button';
import { isLeadershipPreview } from '../../config/environment';

const CATEGORIES: PrayerCategory[] = [
  'Personal',
  'Family',
  'Health',
  'Work / Finances',
  'Relationships',
  'Spiritual Growth',
  'Church / Ministry',
  'Community',
  'Thanksgiving',
  'Other',
];

export const PrayerRequestForm: React.FC = () => {
  // Form fields state
  const [name, setName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<PrayerCategory>('Personal');
  const [requestText, setRequestText] = useState('');
  const [visibility, setVisibility] = useState<PrayerVisibility>('private');
  const [contactPreference, setContactPreference] = useState<'none' | 'email' | 'phone'>('none');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<PrayerSubmissionResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!requestText || requestText.trim().length === 0) {
      errs.requestText = 'Please provide details for your prayer request.';
    } else if (requestText.trim().length < 10) {
      errs.requestText = 'Prayer request should be at least 10 characters long.';
    } else if (requestText.length > 2000) {
      errs.requestText = 'Prayer request cannot exceed 2000 characters.';
    }

    if (!isAnonymous && name.length > 100) {
      errs.name = 'Name cannot exceed 100 characters.';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (contactPreference === 'phone' && (!phone || phone.trim().length < 7)) {
      errs.phone = 'Please enter a valid phone number for follow-up.';
    }

    if (!consent) {
      errs.consent = 'You must acknowledge consent to submit your request.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    if (!validate()) return;

    setIsSubmitting(true);

    const submission: PrayerRequestSubmission = {
      name: isAnonymous ? 'Anonymous' : name.trim() || 'Anonymous',
      isAnonymous,
      email: email.trim() || undefined,
      category,
      request: requestText.trim(),
      visibility,
      contactPreference,
      phone: phone.trim() || undefined,
      consent,
    };

    try {
      const res = await submitPrayerRequest(submission);
      setResult(res);
    } catch {
      setResult({
        success: false,
        message: 'An unexpected error occurred. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setName('');
    setIsAnonymous(false);
    setEmail('');
    setCategory('Personal');
    setRequestText('');
    setVisibility('private');
    setContactPreference('none');
    setPhone('');
    setConsent(false);
    setErrors({});
    setResult(null);
  };

  // SUCCESS CONFIRMATION STATE
  if (result && result.success) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl text-center max-w-2xl mx-auto my-8 space-y-6 animate-fadeIn font-sans">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700 block">
            CONFIRMATION REFERENCE: {result.referenceId}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy uppercase tracking-tight">
            YOUR REQUEST HAS BEEN RECEIVED
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Thank you for allowing us to pray with you. Your prayer request has been logged and received by the Church of God Subic prayer ministry.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-1 text-left font-mono">
          <p><strong className="text-slate-700">Category:</strong> {category}</p>
          <p><strong className="text-slate-700">Submitted As:</strong> {isAnonymous ? 'Anonymous' : name || 'Anonymous'}</p>
          <p><strong className="text-slate-700">Visibility Level:</strong> {visibility === 'private' ? 'Pastoral Leadership Review' : 'Prayer Team Ministry'}</p>
        </div>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Button
            variant="primary"
            size="md"
            icon={RotateCcw}
            onClick={handleResetForm}
          >
            SUBMIT ANOTHER REQUEST
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div id="prayer-form-section" className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 my-8 max-w-3xl mx-auto font-sans">
      <div className="mb-8 text-center sm:text-left border-b border-slate-100 pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gold/10 text-navy font-black text-xs uppercase tracking-wider rounded-full">
          <Heart className="w-3.5 h-3.5 text-gold" />
          <span>PRAYER REQUEST SUBMISSION</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-navy uppercase tracking-tight">
          How Can We Pray With You?
        </h2>
        <p className="text-slate-600 text-sm">
          Please fill out the form below. Your request will be handled with pastoral care and respect by authorized church intercessors.
        </p>
      </div>

      {isLeadershipPreview() && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start space-x-3 text-blue-950 text-xs font-sans shadow-xs">
          <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-black uppercase tracking-wider text-[11px] text-blue-900">
              LEADERSHIP PREVIEW DEMONSTRATION NOTICE
            </p>
            <p className="text-blue-800 leading-relaxed">
              This prayer request form is operating in Leadership Preview demonstration mode. Submissions are processed locally for demonstration purposes only and will not be delivered to pastoral staff.
            </p>
          </div>
        </div>
      )}

      {result && !result.success && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-800 text-sm">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">WE COULDN'T SUBMIT YOUR REQUEST</p>
            <p className="text-xs text-red-700">{result.message}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Name & Anonymous Toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="prayer-name-input" className="block text-xs font-bold uppercase tracking-wider text-navy">
              Your Name <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => {
                  setIsAnonymous(e.target.checked);
                  if (e.target.checked) setName('');
                }}
                className="w-4 h-4 text-navy rounded border-slate-300 focus:ring-navy"
              />
              <span>Submit Anonymously</span>
            </label>
          </div>

          {!isAnonymous && (
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="prayer-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isAnonymous}
                placeholder="e.g. Maria Santos"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${
                  errors.name ? 'border-red-500' : 'border-slate-300'
                } rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-navy focus:bg-white transition-all`}
              />
            </div>
          )}
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="prayer-email-input" className="block text-xs font-bold uppercase tracking-wider text-navy">
            Email Address <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="prayer-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. maria@example.com"
              className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${
                errors.email ? 'border-red-500' : 'border-slate-300'
              } rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-navy focus:bg-white transition-all`}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Email is optional and will only be used if you request pastoral follow-up.
          </p>
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Prayer Category */}
        <div className="space-y-1.5">
          <label htmlFor="prayer-category-select" className="block text-xs font-bold uppercase tracking-wider text-navy">
            Prayer Category <span className="text-red-500">*</span>
          </label>
          <select
            id="prayer-category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value as PrayerCategory)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-navy focus:bg-white transition-all"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Prayer Request Details */}
        <div className="space-y-1.5">
          <label htmlFor="prayer-request-textarea" className="block text-xs font-bold uppercase tracking-wider text-navy">
            Your Prayer Request <span className="text-red-500">*</span>
          </label>
          <textarea
            id="prayer-request-textarea"
            rows={5}
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            placeholder="Share what is on your heart. How can our church family pray for you today?"
            className={`w-full p-4 bg-slate-50 border ${
              errors.requestText ? 'border-red-500' : 'border-slate-300'
            } rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-navy focus:bg-white transition-all`}
          />
          <div className="flex justify-between items-center text-[11px] text-slate-500">
            <span>Please omit highly sensitive personal data if desired.</span>
            <span>{requestText.length} / 2000</span>
          </div>
          {errors.requestText && <p className="text-xs text-red-600">{errors.requestText}</p>}
        </div>

        {/* Privacy & Visibility Options */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-navy flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-gold" />
            <span>Visibility Preference</span>
          </label>

          <div className="space-y-2 text-xs">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={visibility === 'private'}
                onChange={() => setVisibility('private')}
                className="mt-0.5 text-navy focus:ring-navy"
              />
              <div>
                <span className="font-bold text-navy block">Pastoral Leadership Review</span>
                <span className="text-slate-500">
                  Intended for review by authorized Church of God Subic pastoral leaders.
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="prayer_team"
                checked={visibility === 'prayer_team'}
                onChange={() => setVisibility('prayer_team')}
                className="mt-0.5 text-navy focus:ring-navy"
              />
              <div>
                <span className="font-bold text-navy block">Church Prayer Intercessors</span>
                <span className="text-slate-500">
                  Shared with the church intercessory prayer ministry group for prayer gatherings.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Follow-up Contact Preference */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-navy">
            Would you like someone from our team to follow up with you?
          </label>
          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="contactPref"
                value="none"
                checked={contactPreference === 'none'}
                onChange={() => setContactPreference('none')}
                className="text-navy focus:ring-navy"
              />
              <span>No follow-up needed</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="contactPref"
                value="email"
                checked={contactPreference === 'email'}
                onChange={() => setContactPreference('email')}
                className="text-navy focus:ring-navy"
              />
              <span>Email Follow-up (When Available)</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="contactPref"
                value="phone"
                checked={contactPreference === 'phone'}
                onChange={() => setContactPreference('phone')}
                className="text-navy focus:ring-navy"
              />
              <span>Phone Follow-up (When Available)</span>
            </label>
          </div>

          {contactPreference === 'phone' && (
            <div className="pt-2">
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +63 917 123 4567"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${
                    errors.phone ? 'border-red-500' : 'border-slate-300'
                  } rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-navy focus:bg-white transition-all`}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>
          )}
        </div>

        {/* Consent Checkbox */}
        <div className="space-y-1 pt-2">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-navy rounded border-slate-300 focus:ring-navy"
            />
            <span className="text-xs text-slate-600 leading-relaxed font-sans">
              I understand that this prayer request will be submitted to the Church of God – Subic prayer ministry and may be reviewed by authorized church team members for intercession.{' '}
              <span className="text-red-500 font-bold">*</span>
            </span>
          </label>
          {errors.consent && <p className="text-xs text-red-600">{errors.consent}</p>}
        </div>

        {/* Emergency Notice */}
        <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
          <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Please Note:</strong> This prayer form is not an emergency hotline or crisis service. If you or someone you know is in immediate danger or severe medical crisis, please contact local emergency services immediately.
          </span>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center"
            disabled={isSubmitting}
            icon={Send}
            iconPosition="right"
          >
            {isSubmitting ? 'SUBMITTING PRAYER REQUEST...' : 'SUBMIT PRAYER REQUEST'}
          </Button>
        </div>
      </form>
    </div>
  );
};
