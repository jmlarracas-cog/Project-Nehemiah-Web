import React from 'react';
import { LeadershipMember } from '../../types/about';
import { SectionHeader } from '../ui/SectionHeader';
import { LeaderCard } from '../church/LeaderCard';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface LeadershipSectionProps {
  leaders: LeadershipMember[];
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({ leaders }) => {
  const sortedLeaders = [...leaders].sort((a, b) => a.displayOrder - b.displayOrder);
  const hasPending = leaders.some((l) => l.status === 'pending_verification');

  return (
    <section className="py-20 bg-white text-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="OUR PASTORAL SHEPHERDS"
          title="LEADERSHIP TEAM"
          subtitle="Meet the servant leaders guiding Church of God Subic in vision and spiritual care."
          centered
        />

        {hasPending && (
          <div className="flex justify-center mt-4 mb-2">
            <ContentVerificationBadge
              status="pending_verification"
              label="DEMO LEADERSHIP PROFILES — PENDING OFFICIAL CHURCH VERIFICATION"
            />
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {sortedLeaders.map((leader) => (
            <LeaderCard key={leader.id} leader={leader} />
          ))}
        </div>
      </div>
    </section>
  );
};
