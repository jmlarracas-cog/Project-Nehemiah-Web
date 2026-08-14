import React from 'react';
import { Hero } from '../components/ui/Hero';
import { WelcomeSection } from './Home/sections/WelcomeSection';
import { MissionVisionValues } from './Home/sections/MissionVisionValues';
import { FeaturedSermon } from './Home/sections/FeaturedSermon';
import { UpcomingEvents } from './Home/sections/UpcomingEvents';
import { MinistriesSection } from './Home/sections/MinistriesSection';
import { ChurchLocations } from './Home/sections/ChurchLocations';
import { ImpactStatistics } from './Home/sections/ImpactStatistics';
import { PrayerCTA } from './Home/sections/PrayerCTA';
import { GospelSection } from './Home/sections/GospelSection';
import { FinalCTA } from './Home/sections/FinalCTA';
import { assetMap } from '../config/assets';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      {/* 1. CINEMATIC HERO */}
      <Hero
        title="GATHER. GROW. GO."
        goldSubtitle="EXALT JESUS. MAKE DISCIPLES. SERVE OTHERS."
        description="A Christ-centered community committed to exalting Jesus Christ, making passionate disciples, and serving Subic."
        bgImage={assetMap.hero.url}
        primaryCtaLabel="PLAN YOUR VISIT"
        primaryCtaHref="/visit"
        secondaryCtaLabel="WATCH SERMONS"
        secondaryCtaHref="/sermons"
        height="large"
      />

      {/* 2. WELCOME / INTRODUCTION */}
      <WelcomeSection />

      {/* 3. MISSION / VISION / VALUES */}
      <MissionVisionValues />

      {/* 4. FEATURED SERMON */}
      <FeaturedSermon />

      {/* 5. UPCOMING EVENTS */}
      <UpcomingEvents />

      {/* 6. MINISTRIES */}
      <MinistriesSection />

      {/* 7. CHURCH LOCATIONS */}
      <ChurchLocations />

      {/* 8. STATISTICS / IMPACT */}
      <ImpactStatistics />

      {/* 9. PRAYER CTA */}
      <PrayerCTA />

      {/* 10. GOSPEL / SALVATION */}
      <GospelSection />

      {/* 11. FINAL CTA */}
      <FinalCTA />
    </div>
  );
};
