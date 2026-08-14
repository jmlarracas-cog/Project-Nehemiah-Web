import React from 'react';
import { ImpactStatistic } from '../../types';
import { AboutStatistic } from '../../types/about';
import { Users, HeartHandshake, Award, MapPin, Sparkles } from 'lucide-react';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface StatItemProps {
  stat: ImpactStatistic | AboutStatistic;
  isLast?: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users className="w-8 h-8 text-gold" />,
  HeartHandshake: <HeartHandshake className="w-8 h-8 text-gold" />,
  Award: <Award className="w-8 h-8 text-gold" />,
  MapPin: <MapPin className="w-8 h-8 text-gold" />,
};

export const StatItem: React.FC<StatItemProps> = ({ stat, isLast }) => {
  const isPending =
    ('status' in stat && stat.status === 'pending_verification') ||
    ('isVerified' in stat && stat.isVerified === false);

  return (
    <div className={`p-6 sm:p-8 text-center flex flex-col items-center justify-center transition-all duration-300 group relative ${!isLast ? 'lg:border-r lg:border-gold/20' : ''}`}>
      <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gold/20 transition-all duration-300">
        {iconMap[stat.iconName] || <Sparkles className="w-8 h-8 text-gold" />}
      </div>

      {isPending && (
        <div className="mb-2">
          <ContentVerificationBadge status="pending_verification" compact label="DEMO" />
        </div>
      )}

      <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-2 group-hover:text-gold transition-colors duration-300">
        {stat.value}
      </div>
      <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-gold mb-2">
        {stat.label}
      </div>
      <p className="text-sm text-slate-200 max-w-xs mx-auto leading-relaxed font-normal">
        {stat.description}
      </p>
    </div>
  );
};
