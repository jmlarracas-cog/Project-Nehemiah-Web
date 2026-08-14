import React, { useState } from 'react';
import { StatementOfFaithData } from '../../types/about';
import { SectionHeader } from '../ui/SectionHeader';
import { BookOpen, ChevronDown, ChevronUp, Scroll } from 'lucide-react';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface StatementOfFaithProps {
  data: StatementOfFaithData;
}

export const StatementOfFaith: React.FC<StatementOfFaithProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isPending = data.status === 'pending_verification';

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          eyebrow={data.eyebrow || 'DOCTRINAL FOUNDATION'}
          title={data.title}
          subtitle="Anchored firmly in the uncompromised, eternal Word of God."
          light
          centered
        />

        {isPending && (
          <div className="flex justify-center mt-4">
            <ContentVerificationBadge
              status="pending_verification"
              label="DEMO DOCTRINAL DRAFT — PENDING OFFICIAL CHURCH VERIFICATION"
            />
          </div>
        )}

        {/* Intro Summary Box */}
        <div className="mt-8 p-6 sm:p-8 bg-navy-dark/90 border-2 border-gold/30 rounded-xl shadow-2xl text-center">
          <Scroll className="w-10 h-10 text-gold mx-auto mb-4" />
          <p className="text-lg sm:text-xl font-serif italic text-slate-100 max-w-3xl mx-auto leading-relaxed">
            "{data.summary}"
          </p>
        </div>

        {/* Expandable Doctrinal Paragraphs */}
        <div className="mt-8 bg-navy-dark/70 border border-gold/20 rounded-xl p-6 sm:p-8 shadow-xl">
          {/* Always show first 2 paragraphs */}
          <div className="space-y-5 text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
            {data.paragraphs.slice(0, 2).map((paragraph, index) => (
              <p key={index} className="flex items-start space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0 mt-2" />
                <span>{paragraph}</span>
              </p>
            ))}

            {/* Expanded Paragraphs */}
            {isExpanded && (
              <div className="space-y-5 pt-3 border-t border-gold/15 animate-fadeIn">
                {data.paragraphs.slice(2).map((paragraph, index) => (
                  <p key={index + 2} className="flex items-start space-x-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0 mt-2" />
                    <span>{paragraph}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Toggle Expand CTA Button */}
          {data.paragraphs.length > 2 && (
            <div className="mt-8 text-center pt-4 border-t border-gold/15">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs sm:text-sm font-extrabold uppercase tracking-widest hover:bg-gold hover:text-navy transition-all duration-300 focus:outline-hidden focus:ring-2 focus:ring-gold cursor-pointer"
              >
                <span>{isExpanded ? 'COLLAPSE FULL STATEMENT' : 'READ FULL STATEMENT OF FAITH'}</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Supporting Scripture References */}
        {data.scriptureReferences && data.scriptureReferences.length > 0 && (
          <div className="mt-12">
            <h4 className="text-xs sm:text-sm font-black uppercase text-gold tracking-widest text-center mb-6">
              SUPPORTING SCRIPTURAL ANCHORS
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.scriptureReferences.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-navy-dark/80 p-5 rounded-lg border border-gold/20 flex flex-col justify-between"
                >
                  <p className="text-sm text-slate-200 italic mb-4 leading-relaxed">"{item.text}"</p>
                  <span className="text-xs font-bold text-gold uppercase tracking-wider flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 shrink-0" />
                    {item.reference}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
