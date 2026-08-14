import React, { useEffect, useState } from 'react';
import { visitPageData } from '../data/visitData';
import { churchLocationsData } from '../data/churchData';
import { VisitHero } from '../components/visit/VisitHero';
import { WhatToExpect } from '../components/visit/WhatToExpect';
import { VisitorGuide } from '../components/visit/VisitorGuide';
import { VisitServiceInfo } from '../components/visit/VisitServiceInfo';
import { Container } from '../components/ui/Container';
import { ContentVerificationBadge } from '../components/ui/ContentVerificationBadge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { submitContactInquiry } from '../services/contactService';
import {
  Car,
  HeartHandshake,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';

export const VisitPage: React.FC = () => {
  useEffect(() => {
    document.title = visitPageData.seo.title;
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    visitDate: '2026-08-16',
    serviceTime: 'Sunday Worship Service',
    adultsCount: '2',
    kidsCount: '0',
    needsHost: true,
  });

  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mainChurch = churchLocationsData.find((c) => c.isMainBranch) || churchLocationsData[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const result = await submitContactInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        topic: 'Plan Your Visit Inquiry',
        message: `Plan Your Visit Registration: Date: ${formData.visitDate}, Service: ${formData.serviceTime}, Adults: ${formData.adultsCount}, Children: ${formData.kidsCount}, Welcome Host Needed: ${formData.needsHost ? 'Yes' : 'No'}.`,
        consent: true,
      });

      if (result.success && result.referenceId) {
        setSubmittedRef(result.referenceId);
      } else {
        setErrorMessage(result.error || 'Failed to register visit. Please try again.');
      }
    } catch (err) {
      setErrorMessage('An error occurred while submitting your visit registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      
      {/* SECTION 1 — PLAN YOUR VISIT HERO */}
      <VisitHero
        title={visitPageData.hero.title}
        goldSubtitle={visitPageData.hero.goldSubtitle}
        subtitle={visitPageData.hero.subtitle}
        bgImage={visitPageData.hero.bgImage}
      />

      {/* SECTION 2 — WHAT TO EXPECT */}
      <WhatToExpect items={visitPageData.expectationBlocks} />

      {/* SECTION 3 — VISITOR PERKS & REGISTRATION FORM */}
      <section className="py-12 sm:py-16 bg-white">
        <Container size="wide" className="space-y-12">
          
          {/* VIP Welcome Perks Grid */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-gold block">
              GUEST HOSPITALITY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy uppercase tracking-tight">
              First-Time Guest Perks
            </h2>
            <p className="text-slate-600 text-sm">
              Let us know you are coming so our hospitality team can serve you and your family.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-navy/10 border border-navy/20 flex items-center justify-center mx-auto mb-1">
                <Car className="w-6 h-6 text-navy" />
              </div>
              <h3 className="font-bold text-navy text-sm uppercase">Guest Parking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Convenient guest parking directions provided upon arrival.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-navy/10 border border-navy/20 flex items-center justify-center mx-auto mb-1">
                <HeartHandshake className="w-6 h-6 text-navy" />
              </div>
              <h3 className="font-bold text-navy text-sm uppercase">Welcome Host</h3>
              <p className="text-xs text-slate-600 leading-relaxed">A greeter to answer questions and assist with seating.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-navy/10 border border-navy/20 flex items-center justify-center mx-auto mb-1">
                <Sparkles className="w-6 h-6 text-navy" />
              </div>
              <h3 className="font-bold text-navy text-sm uppercase">Children's Ministry</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Age-appropriate Bible teaching in Kingdom Kids.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-navy/10 border border-navy/20 flex items-center justify-center mx-auto mb-1">
                <Users className="w-6 h-6 text-navy" />
              </div>
              <h3 className="font-bold text-navy text-sm uppercase">Fellowship</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Meet church leaders and believers after worship.</p>
            </div>
          </div>

          {/* Form + Location Info Side-by-Side */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Registration Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg space-y-6">
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <span className="text-xs font-black uppercase tracking-widest text-gold block">
                  LET US KNOW YOU'RE COMING
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-navy uppercase tracking-tight">
                  Pre-Register Your Visit
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Filling out this form helps us reserve host greeting for you and your family.
                </p>
              </div>

              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs">
                  {errorMessage}
                </div>
              )}

              {submittedRef ? (
                <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-navy text-xl uppercase tracking-tight">
                    Visit Pre-Registration Received
                  </h4>
                  <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>! Your visit registration reference is:
                  </p>
                  <div className="font-mono font-black text-navy text-base bg-white py-2 px-4 rounded-lg border border-emerald-300 inline-block">
                    {submittedRef}
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Note: Worship schedules are pending administrative verification. Our hospitality team will review your registration.
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" onClick={() => setSubmittedRef(null)}>
                      Register Another Visit
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <Input
                    id="visit-name"
                    label="Your Full Name *"
                    placeholder="e.g. Maria Clara"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      id="visit-email"
                      label="Email Address *"
                      type="email"
                      placeholder="e.g. maria@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Input
                      id="visit-phone"
                      label="Phone Number (Optional)"
                      type="tel"
                      placeholder="e.g. 0917 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="visit-date" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                        Planned Date of Visit *
                      </label>
                      <input
                        id="visit-date"
                        type="date"
                        required
                        value={formData.visitDate}
                        onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                        className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/30 text-xs sm:text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label htmlFor="visit-service" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                        Service Gathering *
                      </label>
                      <select
                        id="visit-service"
                        value={formData.serviceTime}
                        onChange={(e) => setFormData({ ...formData, serviceTime: e.target.value })}
                        className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/30 text-xs sm:text-sm font-medium"
                      >
                        <option value="Sunday Worship Service">Sunday Worship Service</option>
                        <option value="Wednesday Midweek Gathering">Wednesday Midweek Gathering</option>
                        <option value="Saturday Youth Fellowship">Saturday Youth Fellowship</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="visit-adults" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                        Adults Attending
                      </label>
                      <select
                        id="visit-adults"
                        value={formData.adultsCount}
                        onChange={(e) => setFormData({ ...formData, adultsCount: e.target.value })}
                        className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/30 text-xs sm:text-sm font-medium"
                      >
                        <option value="1">1 Adult</option>
                        <option value="2">2 Adults</option>
                        <option value="3">3 Adults</option>
                        <option value="4+">4+ Adults</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="visit-kids" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                        Children Attending
                      </label>
                      <select
                        id="visit-kids"
                        value={formData.kidsCount}
                        onChange={(e) => setFormData({ ...formData, kidsCount: e.target.value })}
                        className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/30 text-xs sm:text-sm font-medium"
                      >
                        <option value="0">No Children</option>
                        <option value="1">1 Child</option>
                        <option value="2">2 Children</option>
                        <option value="3+">3+ Children</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="flex items-start space-x-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.needsHost}
                        onChange={(e) => setFormData({ ...formData, needsHost: e.target.checked })}
                        className="w-4 h-4 text-navy rounded border-slate-300 focus:ring-navy mt-0.5"
                      />
                      <span className="text-xs text-slate-700">
                        Match me with a personal welcome greeter when I arrive.
                      </span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="w-full justify-center py-3.5"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>SUBMITTING REGISTRATION...</span>
                      </>
                    ) : (
                      <span>PRE-REGISTER MY VISIT</span>
                    )}
                  </Button>

                </form>
              )}

            </div>

            {/* Main Campus Summary Info */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-navy text-white p-6 sm:p-8 rounded-2xl border border-navy-light space-y-6 shadow-md">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gold block">
                    SUBIC WORSHIP LOCATION
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-tight">
                    {mainChurch.name}
                  </h3>
                  <ContentVerificationBadge status={mainChurch.status} />
                </div>

                <div className="space-y-3 text-xs text-slate-200">
                  <div className="flex items-start space-x-3 p-3 bg-navy-light/60 rounded-xl border border-navy-light">
                    <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-bold">Address:</strong>
                      <span>{mainChurch.address.formattedAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-navy-light/60 rounded-xl border border-navy-light">
                    <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-bold">Service Times:</strong>
                      <span>Service schedule pending official verification</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="gold"
                    size="md"
                    className="w-full justify-center"
                    onClick={() => {
                      window.location.href = `/churches/${mainChurch.slug}`;
                    }}
                  >
                    <span>VIEW CHURCH CAMPUS PAGE</span>
                    <ChevronRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>

              {/* All Campuses Link Card */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-center">
                <h4 className="font-black text-navy text-sm uppercase tracking-wider">
                  Looking for Other Locations?
                </h4>
                <p className="text-slate-600 text-xs">
                  We serve believers across worship locations in Subic, Olongapo, and Zambales.
                </p>
                <a
                  href="/churches"
                  className="inline-flex items-center text-xs font-bold text-navy hover:text-gold uppercase tracking-wider underline transition-colors"
                >
                  Explore Church Directory <ChevronRight className="w-4 h-4 ml-0.5" />
                </a>
              </div>

            </div>

          </div>

        </Container>
      </section>

      {/* SECTION 4 — SERVICE INFORMATION */}
      <VisitServiceInfo services={visitPageData.services} />

      {/* SECTION 5 — VISITOR GUIDE (FAQ) */}
      <VisitorGuide items={visitPageData.guideItems} />

    </div>
  );
};
