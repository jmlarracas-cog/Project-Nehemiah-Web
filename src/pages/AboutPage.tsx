import React, { useEffect } from 'react';
import { aboutPageData } from '../data/aboutData';
import { AboutHero } from '../components/about/AboutHero';
import { StorySection } from '../components/about/StorySection';
import { MissionVisionValues } from '../components/about/MissionVisionValues';
import { StatementOfFaith } from '../components/about/StatementOfFaith';
import { CoreBeliefs } from '../components/about/CoreBeliefs';
import { LeadershipSection } from '../components/about/LeadershipSection';
import { ChurchTimeline } from '../components/about/ChurchTimeline';
import { AboutStatistics } from '../components/about/AboutStatistics';
import { AboutCTA } from '../components/about/AboutCTA';

export const AboutPage: React.FC = () => {
  const data = aboutPageData;

  useEffect(() => {
    // Set Page Title & Meta Description for SEO Foundation
    document.title = data.seo.title || 'About Our Church | Church of God – Subic';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', data.seo.description);
    }
  }, [data]);

  return (
    <div className="bg-background min-h-screen">
      {/* 1. CINEMATIC ABOUT HERO */}
      <AboutHero
        title={data.hero.title}
        goldSubtitle={data.hero.goldSubtitle}
        subtitle={data.hero.subtitle}
        bgImage={data.hero.bgImage}
        imageAlt={data.hero.imageAlt}
      />

      {/* 2. OUR STORY (EDITORIAL 2-COLUMN) */}
      <StorySection
        eyebrow={data.story.eyebrow}
        title={data.story.title}
        paragraphs={data.story.paragraphs}
        scripture={data.story.scripture}
        imageUrl={data.story.imageUrl}
        imageAlt={data.story.imageAlt}
        status={data.story.status}
        isVerifiedContent={data.story.isVerifiedContent}
      />

      {/* 3. MISSION / VISION / VALUES */}
      <MissionVisionValues
        mission={data.mission}
        vision={data.vision}
        values={data.values}
      />

      {/* 4. STATEMENT OF FAITH */}
      <StatementOfFaith data={data.statementOfFaith} />

      {/* 5. CORE BELIEFS */}
      <CoreBeliefs beliefs={data.coreBeliefs} />

      {/* 6. LEADERSHIP TEAM */}
      <LeadershipSection leaders={data.leadership} />

      {/* 7. CHURCH JOURNEY / TIMELINE */}
      <ChurchTimeline events={data.journey} />

      {/* 8. ABOUT STATISTICS */}
      <AboutStatistics statistics={data.statistics} />

      {/* 9. FINAL CLOSING CTA */}
      <AboutCTA
        title={data.cta.title}
        subtitle={data.cta.subtitle}
        primaryAction={data.cta.primaryAction}
        secondaryAction={data.cta.secondaryAction}
      />
    </div>
  );
};
