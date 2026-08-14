import React, { useState, useEffect } from 'react';
import { MinistriesPageData, Ministry } from '../types/ministry';
import { ministriesPageData } from '../data/ministryData';
import { MinistriesHero } from '../components/ministries/MinistriesHero';
import { MinistryIntro } from '../components/ministries/MinistryIntro';
import { MinistryGrid } from '../components/ministries/MinistryGrid';
import { MinistryCTA } from '../components/ministries/MinistryCTA';
import { ContentVerificationBadge } from '../components/ui/ContentVerificationBadge';
import { Button } from '../components/ui/Button';
import { X, Clock, MapPin, Mail, Check, BookOpen, UserCheck, ArrowRight } from 'lucide-react';

export const MinistriesPage: React.FC = () => {
  const data: MinistriesPageData = ministriesPageData;
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);

  useEffect(() => {
    // Set Page SEO Metadata
    document.title = data.seo.title || 'Ministries | Church of God – Subic';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', data.seo.description);
    }
  }, [data]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMinistry(null);
      }
    };
    if (selectedMinistry) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMinistry]);

  return (
    <div className="bg-background min-h-screen">
      {/* 1. HERO SECTION */}
      <MinistriesHero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        bgImage={data.hero.bgImage}
        imageAlt={data.hero.imageAlt}
      />

      {/* 2. PURPOSE OF MINISTRY INTRO */}
      <MinistryIntro
        eyebrow={data.intro.eyebrow}
        title={data.intro.title}
        subtitle={data.intro.subtitle}
        description={data.intro.description}
        scripture={data.intro.scripture}
      />

      {/* 3. CATEGORY FILTER & RESPONSIVE MINISTRY GRID */}
      <MinistryGrid
        ministries={data.ministries}
        categories={data.categories}
        onSelectMinistry={(ministry) => setSelectedMinistry(ministry)}
      />

      {/* 4. CLOSING CTA SECTION */}
      <MinistryCTA
        title={data.cta.title}
        subtitle={data.cta.subtitle}
        primaryAction={data.cta.primaryAction}
        secondaryAction={data.cta.secondaryAction}
      />

      {/* 5. INTERACTIVE MINISTRY PREVIEW MODAL */}
      {selectedMinistry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedMinistry(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-ministry-title"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col my-auto">
            {/* Modal Image Header */}
            <div className="relative aspect-16/9 bg-navy shrink-0">
              {selectedMinistry.imageUrl ? (
                <img
                  src={selectedMinistry.imageUrl}
                  alt={selectedMinistry.imageAlt || selectedMinistry.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-navy flex items-center justify-center p-6 text-center">
                  <h3 className="text-xl font-black uppercase text-gold">
                    {selectedMinistry.name}
                  </h3>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />

              <button
                onClick={() => setSelectedMinistry(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-navy/70 text-white hover:bg-gold hover:text-navy transition-colors focus:outline-hidden focus:ring-2 focus:ring-gold cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gold bg-navy px-2.5 py-0.5 rounded-full">
                    {selectedMinistry.category}
                  </span>
                  {selectedMinistry.status === 'pending_verification' && (
                    <ContentVerificationBadge
                      status="pending_verification"
                      compact
                      label="DEMO PROFILE"
                    />
                  )}
                </div>
                <h3
                  id="modal-ministry-title"
                  className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight"
                >
                  {selectedMinistry.name}
                </h3>
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-slate-700">
              <p className="text-sm leading-relaxed text-slate-700">
                {selectedMinistry.description}
              </p>

              {/* Schedule and Location Box */}
              {selectedMinistry.meetingSchedule && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-navy block uppercase tracking-wider">
                        Meeting Time
                      </span>
                      <span>
                        {selectedMinistry.meetingSchedule.day} • {selectedMinistry.meetingSchedule.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-navy block uppercase tracking-wider">
                        Location
                      </span>
                      <span>{selectedMinistry.meetingSchedule.location || 'Subic Main Sanctuary'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Highlights */}
              {selectedMinistry.highlights && selectedMinistry.highlights.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-navy mb-2">
                    Key Features & Activities:
                  </h4>
                  <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    {selectedMinistry.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Leader Info */}
              {selectedMinistry.leader && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-gold" />
                    <span className="font-bold text-navy">
                      Led by {selectedMinistry.leader.name}
                    </span>
                  </div>
                  {selectedMinistry.leader.email && (
                    <a
                      href={`mailto:${selectedMinistry.leader.email}`}
                      className="text-gold font-bold hover:underline flex items-center"
                    >
                      <Mail className="w-3.5 h-3.5 mr-1" /> Contact Leader
                    </a>
                  )}
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <a
                  href={`/ministries/${selectedMinistry.slug}`}
                  className="inline-flex items-center text-xs font-black uppercase text-navy hover:text-gold transition-colors"
                >
                  FULL PAGE DETAILS <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </a>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMinistry(null)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    CLOSE
                  </Button>
                  <Button variant="primary" size="sm" href="/contact">
                    GET INVOLVED TODAY
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
