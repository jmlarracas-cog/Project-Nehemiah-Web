import React from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { Quote } from 'lucide-react';
import { ContentStatus } from '../../types/about';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface StorySectionProps {
  eyebrow?: string;
  title: string;
  paragraphs: string[];
  scripture?: {
    quote: string;
    reference: string;
  };
  imageUrl: string;
  imageAlt?: string;
  status?: ContentStatus;
  isVerifiedContent?: boolean;
}

export const StorySection: React.FC<StorySectionProps> = ({
  eyebrow = 'OUR STORY & HERITAGE',
  title,
  paragraphs,
  scripture,
  imageUrl,
  imageAlt = 'Church of God Subic historical gathering',
  status = 'pending_verification',
  isVerifiedContent,
}) => {
  const currentStatus = isVerifiedContent ? 'published' : status;

  return (
    <section className="py-16 sm:py-24 bg-white text-navy overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Column 1: Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeader
              eyebrow={eyebrow}
              title={title}
              subtitle="Anchored in grace, called to transform lives across Subic, Zambales and the surrounding region."
            />

            {currentStatus === 'pending_verification' && (
              <ContentVerificationBadge
                status="pending_verification"
                label="DEMO HISTORY — PENDING OFFICIAL CHURCH VERIFICATION"
              />
            )}

            <div className="space-y-5 text-slate-700 leading-relaxed text-base sm:text-lg font-normal">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Scripture Callout Block */}
            {scripture && (
              <div className="p-5 sm:p-6 bg-slate-50 rounded-lg border-l-4 border-gold shadow-xs relative">
                <Quote className="w-8 h-8 text-gold/30 absolute right-4 top-4" />
                <p className="text-base sm:text-lg font-serif italic text-navy mb-2">
                  "{scripture.quote}"
                </p>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gold">
                  — {scripture.reference}
                </p>
              </div>
            )}

            <div className="pt-2 flex flex-wrap gap-4">
              <Button variant="primary" size="md" href="/visit">
                PLAN YOUR VISIT
              </Button>
              <Button variant="outline" size="md" href="/contact">
                CONTACT OUR TEAM
              </Button>
            </div>
          </div>

          {/* Column 2: Editorial Image Frame */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Decorative Background Frame Offset */}
              <div className="absolute -inset-2 rounded-xl bg-gradient-to-tr from-navy to-gold/40 opacity-30 blur-sm transform rotate-1" />

              <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white bg-navy">
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="w-full h-[380px] sm:h-[460px] object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm font-medium backdrop-blur-xs bg-navy/70 p-3.5 rounded-lg border border-white/10">
                  <span className="font-bold text-gold uppercase block text-xs tracking-widest mb-1">
                    Church Family
                  </span>
                  United in worship, discipleship, and community service.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
