import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { PrayerFAQItem } from '../../types/prayer';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface PrayerFAQProps {
  faqs: PrayerFAQItem[];
}

export const PrayerFAQ: React.FC<PrayerFAQProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 text-gold font-bold text-xs uppercase tracking-widest">
            <HelpCircle className="w-4 h-4" />
            <span>QUESTIONS & ANSWERS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-navy uppercase tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between font-black text-navy text-sm sm:text-base font-sans hover:bg-slate-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center space-x-3">
                    <span className="text-gold font-extrabold text-xs">0{index + 1}.</span>
                    <span>{faq.question}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gold shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3 space-y-3 font-sans">
                    <p>{faq.answer}</p>
                    {faq.status === 'pending_verification' && (
                      <ContentVerificationBadge
                        status="pending_verification"
                        notes="Awaiting formal pastoral procedure verification."
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
