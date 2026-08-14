import React from 'react';
import { Container } from '../../../components/ui/Container';
import { StatItem } from '../../../components/church/StatItem';
import { statisticsData } from '../../../data/churchData';

export const ImpactStatistics: React.FC = () => {
  return (
    <section className="py-20 bg-navy text-white relative overflow-hidden border-y border-gold/20">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-40 pointer-events-none" />

      <Container size="wide" className="relative z-10">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase text-gold tracking-widest block mb-2">
            GOD’S FAITHFULNESS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
            IMPACT & KINGDOM GROWTH
          </h2>
          <div className="h-1 w-16 bg-gold mx-auto mt-3 rounded-full" />
        </div>

        <div className="bg-navy-dark/90 border border-gold/30 rounded-lg shadow-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gold/20">
          {statisticsData.map((stat, index) => (
            <StatItem
              key={stat.id}
              stat={stat}
              isLast={index === statisticsData.length - 1}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

