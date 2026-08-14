import React, { useEffect } from 'react';
import { contactPageData } from '../data/contactData';
import { ContactOptions } from '../components/contact/ContactOptions';
import { ContactForm } from '../components/contact/ContactForm';
import { Container } from '../components/ui/Container';
import { ContentVerificationBadge } from '../components/ui/ContentVerificationBadge';
import { BrandLogo } from '../components/ui/BrandLogo';
import { Clock, ShieldAlert, Heart, Mail, Phone, MapPin } from 'lucide-react';

interface ContactPageProps {
  topicSlug?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ topicSlug }) => {
  useEffect(() => {
    document.title = contactPageData.seo.title;
  }, []);

  // Determine initial default topic if topicSlug matches
  let defaultTopicName = 'General Inquiry';
  if (topicSlug) {
    const matchedTopic = contactPageData.topics.find(
      (t) => t.id === topicSlug || t.name.toLowerCase().includes(topicSlug.toLowerCase())
    );
    if (matchedTopic) {
      defaultTopicName = matchedTopic.name;
    }
  }

  return (
    <div className="bg-white min-h-screen">
      
      {/* SECTION 1 — CONTACT HERO */}
      <section className="relative bg-navy text-white overflow-hidden py-16 sm:py-24 border-b border-navy-light">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={contactPageData.hero.bgImage}
            alt="Church of God Subic Contact Center"
            className="w-full h-full object-cover object-center filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/95 to-navy" />
        </div>

        {/* Decorative Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-navy via-gold to-navy z-10" />

        <Container size="wide" className="relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="inline-flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              <a href="/" className="hover:text-gold transition-colors">Home</a>
              <span className="text-gold/60">•</span>
              <span className="text-gold">Contact Us</span>
            </nav>

            {/* Logo */}
            <div className="flex justify-center pt-2">
              <BrandLogo size="md" variant="light" className="opacity-95" />
            </div>

            {/* Governance Badge */}
            <div className="pt-1 flex justify-center">
              <ContentVerificationBadge
                status={contactPageData.hero.status}
                notes={contactPageData.hero.meta?.notes}
              />
            </div>

            {/* Title */}
            <div className="space-y-3">
              <span className="text-xs sm:text-sm font-black tracking-widest text-gold uppercase flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-gold" />
                <span>{contactPageData.hero.goldSubtitle}</span>
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase">
                {contactPageData.hero.title}
              </h1>
              <p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed">
                {contactPageData.hero.subtitle}
              </p>
            </div>

          </div>
        </Container>
      </section>

      {/* SECTION 2 — CONTENT GOVERNANCE ALERT */}
      <Container size="wide" className="pt-8">
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs sm:text-sm space-y-1.5 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="font-bold uppercase tracking-wider text-amber-900 text-xs">
              Administrative Verification Notice
            </h2>
            <p className="text-amber-800 leading-relaxed text-xs sm:text-sm">
              Official church phone numbers, email addresses, and office operating hours listed below are representative placeholders undergoing pastoral verification. Form submissions are safely routed for church ministry review.
            </p>
          </div>
        </div>
      </Container>

      {/* SECTION 3 — MAIN CONTENT GRID */}
      <section className="py-10 sm:py-16 bg-white">
        <Container size="wide">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Contact Channels & Office Hours (5 Cols) */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Contact Channels Component */}
              <ContactOptions channels={contactPageData.channels} />

              {/* Office Hours Box */}
              <div className="bg-navy text-white p-6 sm:p-8 rounded-2xl border border-navy-light space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-navy-light pb-3">
                  <h3 className="font-black text-white text-base uppercase tracking-tight flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gold" />
                    <span>Office Hours</span>
                  </h3>
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider bg-gold/10 px-2.5 py-1 rounded-md border border-gold/30">
                    Pending Verification
                  </span>
                </div>

                <ul className="text-xs space-y-2.5 text-slate-200">
                  <li className="flex justify-between items-center py-1 border-b border-navy-light/40">
                    <span className="font-medium text-slate-300">Tuesday – Saturday:</span>
                    <span className="font-bold text-white">8:30 AM – 5:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center py-1 border-b border-navy-light/40">
                    <span className="font-medium text-slate-300">Sunday Worship:</span>
                    <span className="font-bold text-white">7:00 AM – 1:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center py-1 text-slate-400">
                    <span className="font-medium">Monday:</span>
                    <span className="font-bold italic">Closed / Rest Day</span>
                  </li>
                </ul>

                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  Representative office hours subject to official administrative confirmation.
                </p>
              </div>

            </div>

            {/* Right Column: Contact Form (7 Cols) */}
            <div className="lg:col-span-7">
              <ContactForm
                topics={contactPageData.topics}
                defaultTopic={defaultTopicName}
              />
            </div>

          </div>
        </Container>
      </section>

    </div>
  );
};
