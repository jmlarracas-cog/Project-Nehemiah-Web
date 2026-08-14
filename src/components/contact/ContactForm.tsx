import React, { useState } from 'react';
import { ContactTopic } from '../../types/contact';
import { submitContactInquiry } from '../../services/contactService';
import { Button } from '../ui/Button';
import { Input, TextArea } from '../ui/Input';
import { Send, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Info } from 'lucide-react';
import { isLeadershipPreview } from '../../config/environment';

interface ContactFormProps {
  topics: ContactTopic[];
  defaultTopic?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  topics,
  defaultTopic = 'General Inquiry'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: defaultTopic,
    message: '',
    consent: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successRef, setSuccessRef] = useState<string | null>(null);

  const characterCount = formData.message.length;
  const maxCharacters = 1000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.consent) {
      setErrorMessage('Please accept the ministry consent checkbox before submitting.');
      return;
    }

    setLoading(true);

    try {
      const result = await submitContactInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        topic: formData.topic,
        message: formData.message,
        consent: formData.consent,
      });

      if (result.success && result.referenceId) {
        setSuccessRef(result.referenceId);
      } else {
        setErrorMessage(result.error || 'Unable to submit message. Please try again.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessRef(null);
    setErrorMessage(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      topic: defaultTopic,
      message: '',
      consent: false,
    });
  };

  if (successRef) {
    return (
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-emerald-200 shadow-lg text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
            MESSAGE SUBMITTED
          </span>
          <h3 className="text-2xl font-black text-navy uppercase tracking-tight">
            Thank You For Reaching Out
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Your inquiry has been received by our administrative ministry office. We appreciate your communication with Church of God – Subic.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-sm mx-auto text-left space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Submission Reference Code:
          </span>
          <span className="font-mono text-sm font-black text-navy block">
            {successRef}
          </span>
          <span className="text-[10px] text-slate-400 block pt-1">
            Keep this reference code for future inquiry follow-ups.
          </span>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={handleReset}
            className="hover:bg-navy hover:text-gold transition-colors"
          >
            SEND ANOTHER MESSAGE
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-lg space-y-6">
      
      {/* Form Header */}
      <div className="space-y-1 border-b border-slate-100 pb-4">
        <h3 className="text-xl sm:text-2xl font-black text-navy uppercase tracking-tight">
          Send Us A Message
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm">
          Submit your question, request, or comment directly to our ministry staff.
        </p>
      </div>

      {isLeadershipPreview() && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start space-x-3 text-blue-950 text-xs font-sans shadow-xs">
          <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-black uppercase tracking-wider text-[11px] text-blue-900">
              LEADERSHIP PREVIEW DEMONSTRATION NOTICE
            </p>
            <p className="text-blue-800 leading-relaxed">
              This contact form is operating in Leadership Preview demonstration mode. Messages are processed locally for demonstration purposes only and will not be delivered to pastoral staff.
            </p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start space-x-3" role="alert">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-semibold">{errorMessage}</p>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name Input */}
        <Input
          id="contact-name"
          label="Full Name *"
          placeholder="e.g. Juan Dela Cruz"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        {/* Email & Phone Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            id="contact-email"
            label="Email Address *"
            type="email"
            placeholder="e.g. juan@example.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            id="contact-phone"
            label="Phone Number (Optional)"
            type="tel"
            placeholder="e.g. 0917 123 4567"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        {/* Topic Dropdown */}
        <div>
          <label htmlFor="contact-topic" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
            Inquiry Topic / Subject *
          </label>
          <select
            id="contact-topic"
            required
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy text-xs sm:text-sm font-medium transition-all shadow-xs"
          >
            {topics.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name} ({t.category})
              </option>
            ))}
          </select>
        </div>

        {/* Message Text Area */}
        <div>
          <TextArea
            id="contact-message"
            label="Your Message *"
            placeholder="Please write your inquiry, prayer request, or message here..."
            rows={5}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
            <span>Minimum 10 characters</span>
            <span className={characterCount > maxCharacters ? 'text-red-600 font-bold' : ''}>
              {characterCount} / {maxCharacters} chars
            </span>
          </div>
        </div>

        {/* Privacy & Consent Checkbox */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="contact-consent"
              required
              checked={formData.consent}
              onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
              className="w-4 h-4 text-navy rounded border-slate-300 focus:ring-navy mt-0.5 cursor-pointer"
            />
            <label htmlFor="contact-consent" className="text-xs text-slate-700 cursor-pointer select-none leading-relaxed">
              <strong className="text-navy font-bold block">Ministry Review Consent:</strong>
              I understand that my message is submitted for church ministry review and pastoral response.
            </label>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-slate-500 pl-7">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Submitted information is held for church ministry follow-up only.</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || characterCount > maxCharacters}
            className="w-full justify-center py-3.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>SUBMITTING MESSAGE...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                <span>SEND MESSAGE</span>
              </>
            )}
          </Button>
        </div>

      </form>

    </div>
  );
};
