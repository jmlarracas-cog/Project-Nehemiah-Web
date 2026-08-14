import React, { useEffect } from 'react';
import { prayerData } from '../data/prayerData';
import { PrayerHero } from '../components/prayer/PrayerHero';
import { PrayerIntro } from '../components/prayer/PrayerIntro';
import { PrayerRequestForm } from '../components/prayer/PrayerRequestForm';
import { PrayerScripture } from '../components/prayer/PrayerScripture';
import { PrayerMinistry } from '../components/prayer/PrayerMinistry';
import { PrayerFAQ } from '../components/prayer/PrayerFAQ';
import { PrayerPrivacyNotice } from '../components/prayer/PrayerPrivacyNotice';

export const PrayerPage: React.FC = () => {
  useEffect(() => {
    document.title = prayerData.seo.title;
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <PrayerHero
        title={prayerData.hero.title}
        goldSubtitle={prayerData.hero.goldSubtitle}
        subtitle={prayerData.hero.subtitle}
        bgImage={prayerData.hero.bgImage}
        imageAlt={prayerData.hero.imageAlt}
      />

      {/* Intro Section */}
      <PrayerIntro
        title={prayerData.intro.title}
        description={prayerData.intro.description}
        status={prayerData.intro.status}
      />

      {/* Main Interactive Prayer Request Form */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <PrayerRequestForm />
      </section>

      {/* Scripture Promises */}
      <PrayerScripture scriptures={prayerData.scriptures} />

      {/* Ministry & Gatherings */}
      <PrayerMinistry />

      {/* FAQ */}
      <PrayerFAQ faqs={prayerData.faqs} />

      {/* Privacy Notice */}
      <PrayerPrivacyNotice notice={prayerData.privacyNotice} />
    </div>
  );
};
