import React from 'react';
import { AboutStatistic } from '../../types/about';
import { StatItem } from '../church/StatItem';
import { SectionHeader } from '../ui/SectionHeader';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface AboutStatisticsProps {
  statistics: AboutStatistic[];
}

export const AboutStatistics: React.FC<AboutStatisticsProps> = ({ statistics }) => {
  const hasUnverified = statistics.some(
    (s) => s.status === 'pending_verification' || s.isVerified === false
  );

  return (
    <section className="py-20 bg-navy text-white relative overflow-hidden border-y border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          eyebrow="GOD'S FAITHFUL MULTIPLICATION"
          title="KINGDOM IMPACT IN NUMBERS"
          subtitle="A testimony of God's grace across Subic, Zambales and Zambales province."
          light
          centered
        />

        {hasUnverified && (
          <div className="flex justify-center mt-4 mb-8">
            <ContentVerificationBadge
              status="pending_verification"
              label="DEMO METRICS — PENDING OFFICIAL CHURCH VERIFICATION"
            />
          </div>
        )}

        <div className="bg-navy-dark/90 border border-gold/30 rounded-xl shadow-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gold/20">
          {statistics.map((stat, index) => (
            <StatItem
              key={stat.id}
              stat={stat}
              isLast={index === statistics.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
