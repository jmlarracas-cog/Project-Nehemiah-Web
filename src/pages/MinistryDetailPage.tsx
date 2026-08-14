import React, { useEffect } from 'react';
import { MinistriesPageData, Ministry } from '../types/ministry';
import { ministriesPageData } from '../data/ministryData';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { ContentVerificationBadge } from '../components/ui/ContentVerificationBadge';
import { Button } from '../components/ui/Button';
import {
  Clock,
  MapPin,
  Mail,
  Phone,
  UserCheck,
  BookOpen,
  Check,
  ArrowLeft,
  Sparkles,
  Calendar,
  Share2,
} from 'lucide-react';
import { MinistryCard } from '../components/ministries/MinistryCard';

interface MinistryDetailPageProps {
  slug: string;
  onNavigateBack?: () => void;
}

export const MinistryDetailPage: React.FC<MinistryDetailPageProps> = ({
  slug,
  onNavigateBack,
}) => {
  const data: MinistriesPageData = ministriesPageData;

  const ministry: Ministry | undefined = data.ministries.find(
    (m) => m.slug === slug || m.id === slug
  );

  useEffect(() => {
    if (ministry) {
      document.title = `${ministry.name} | Church of God – Subic Ministries`;
      window.scrollTo(0, 0);
    }
  }, [ministry]);

  if (!ministry) {
    return (
      <div className="min-h-[60vh] bg-background flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-black text-navy uppercase mb-2">
          MINISTRY NOT FOUND
        </h2>
        <p className="text-slate-600 mb-6 text-sm">
          The ministry you are looking for could not be found or has been relocated.
        </p>
        <Button variant="primary" href="/ministries">
          RETURN TO MINISTRIES
        </Button>
      </div>
    );
  }

  const isPending = ministry.status === 'pending_verification';

  const relatedMinistries = data.ministries
    .filter((m) => m.id !== ministry.id)
    .slice(0, 3);

  return (
    <div className="bg-background min-h-screen">
      {/* 1. MINISTRY DETAIL HERO */}
      <section className="relative bg-navy text-white pt-24 pb-16 overflow-hidden border-b border-gold/30">
        <div className="absolute inset-0 z-0">
          {ministry.imageUrl && (
            <img
              src={ministry.imageUrl}
              alt={ministry.imageAlt || ministry.name}
              className="w-full h-full object-cover filter brightness-75"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <Breadcrumb
              items={[
                { label: 'MINISTRIES', href: '/ministries' },
                { label: ministry.name.toUpperCase() },
              ]}
              light
            />

            <a
              href="/ministries"
              className="inline-flex items-center text-xs font-black uppercase text-gold hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> BACK TO MINISTRIES
            </a>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-black uppercase tracking-widest text-gold bg-navy-dark px-3 py-1 rounded-full border border-gold/30">
                {ministry.category}
              </span>

              {isPending && (
                <ContentVerificationBadge
                  status="pending_verification"
                  compact
                  label="DEMO RECORD"
                />
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              {ministry.name}
            </h1>

            {ministry.tagline && (
              <p className="text-sm sm:text-base font-extrabold uppercase text-gold tracking-widest">
                {ministry.tagline}
              </p>
            )}

            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed">
              {ministry.description}
            </p>
          </div>
        </div>
      </section>

      {/* 2. MAIN DETAIL CONTENT & SIDEBAR */}
      <section className="py-16 bg-white text-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Left Column: Full Overview & Highlights */}
            <div className="lg:col-span-8 space-y-8">
              {/* Verification Notice Banner */}
              {isPending && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3">
                  <ContentVerificationBadge
                    status="pending_verification"
                    label="DEMO MINISTRY DETAILS — PENDING OFFICIAL CHARTER VERIFICATION"
                  />
                </div>
              )}

              {/* Overview & Purpose */}
              <div className="prose max-w-none text-slate-700 space-y-4">
                <h3 className="text-xl font-black text-navy uppercase tracking-tight">
                  About {ministry.name}
                </h3>
                <p className="text-base leading-relaxed">
                  {ministry.description}
                </p>
              </div>

              {/* Scripture Anchor */}
              {ministry.scripture && (
                <div className="p-6 rounded-xl bg-slate-50 border-l-4 border-gold shadow-sm space-y-2">
                  <div className="flex items-center space-x-2 text-gold font-bold text-xs uppercase tracking-widest">
                    <BookOpen className="w-4 h-4" />
                    <span>Scripture Anchor</span>
                  </div>
                  <p className="italic text-slate-800 font-serif text-base leading-relaxed">
                    "{ministry.scripture.text}"
                  </p>
                  <span className="text-xs font-black uppercase text-navy block">
                    — {ministry.scripture.reference}
                  </span>
                </div>
              )}

              {/* Highlights List */}
              {ministry.highlights && ministry.highlights.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-navy uppercase tracking-tight">
                    Key Highlights & Activities
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {ministry.highlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center space-x-3 text-xs sm:text-sm text-navy font-bold"
                      >
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ministry Leader Profile Box */}
              {ministry.leader && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  {ministry.leader.imageUrl && (
                    <img
                      src={ministry.leader.imageUrl}
                      alt={ministry.leader.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-gold shrink-0 shadow-md"
                    />
                  )}
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gold bg-navy px-2.5 py-0.5 rounded-full inline-block">
                      {ministry.leader.position || 'MINISTRY LEADER'}
                    </span>
                    <h4 className="text-lg font-black text-navy uppercase">
                      {ministry.leader.name}
                    </h4>
                    {ministry.leader.email && (
                      <a
                        href={`mailto:${ministry.leader.email}`}
                        className="text-xs font-semibold text-gold hover:underline inline-flex items-center justify-center sm:justify-start"
                      >
                        <Mail className="w-3.5 h-3.5 mr-1" /> {ministry.leader.email}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Schedule & Info Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-navy text-white rounded-2xl p-6 shadow-xl border border-gold/30 space-y-6">
                <h3 className="text-lg font-black uppercase text-white border-b border-gold/20 pb-3">
                  MINISTRY DETAILS
                </h3>

                {/* Meeting Schedule */}
                {ministry.meetingSchedule && (
                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-gold uppercase tracking-wider block">
                      Meeting Schedule
                    </span>
                    <div className="flex items-start space-x-2 text-slate-200">
                      <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-white">
                          {ministry.meetingSchedule.day} • {ministry.meetingSchedule.time}
                        </p>
                        <p className="text-slate-300">{ministry.meetingSchedule.frequency}</p>
                      </div>
                    </div>
                    {ministry.meetingSchedule.location && (
                      <div className="flex items-start space-x-2 text-slate-200 pt-2">
                        <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          {ministry.meetingSchedule.location}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Target Age Group */}
                {ministry.ageGroup && (
                  <div className="space-y-1 text-xs border-t border-gold/15 pt-4">
                    <span className="font-bold text-gold uppercase tracking-wider block">
                      Target Audience / Age Group
                    </span>
                    <p className="text-slate-200">{ministry.ageGroup}</p>
                  </div>
                )}

                {/* Direct Contact */}
                {ministry.contact && (
                  <div className="space-y-2 text-xs border-t border-gold/15 pt-4">
                    <span className="font-bold text-gold uppercase tracking-wider block">
                      Direct Contact
                    </span>
                    {ministry.contact.email && (
                      <a
                        href={`mailto:${ministry.contact.email}`}
                        className="flex items-center text-slate-200 hover:text-gold transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-2 text-gold" />
                        <span>{ministry.contact.email}</span>
                      </a>
                    )}
                    {ministry.contact.phone && (
                      <a
                        href={`tel:${ministry.contact.phone}`}
                        className="flex items-center text-slate-200 hover:text-gold transition-colors"
                      >
                        <Phone className="w-4 h-4 mr-2 text-gold" />
                        <span>{ministry.contact.phone}</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Primary Get Involved CTA Button */}
                <div className="pt-4 border-t border-gold/20">
                  <Button
                    variant="primary"
                    size="md"
                    href="/contact"
                    className="w-full justify-center"
                  >
                    GET INVOLVED NOW
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Ministries Section */}
          <div className="mt-20 pt-12 border-t border-slate-200">
            <h3 className="text-2xl font-black text-navy uppercase mb-8 text-center">
              EXPLORE OTHER MINISTRIES
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedMinistries.map((m) => (
                <MinistryCard key={m.id} ministry={m} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
