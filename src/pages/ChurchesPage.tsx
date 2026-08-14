import React, { useEffect } from 'react';
import { churchesPageData } from '../data/churchData';
import { ChurchesHero } from '../components/church/ChurchesHero';
import { ChurchDirectory } from '../components/church/ChurchDirectory';

export const ChurchesPage: React.FC = () => {
  useEffect(() => {
    document.title = churchesPageData.seo.title;
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header Section */}
      <ChurchesHero
        title={churchesPageData.hero.title}
        goldSubtitle={churchesPageData.hero.goldSubtitle}
        subtitle={churchesPageData.hero.subtitle}
        bgImage={churchesPageData.hero.bgImage}
      />

      {/* Main Church Directory Component */}
      <ChurchDirectory churches={churchesPageData.churches} />
    </div>
  );
};
