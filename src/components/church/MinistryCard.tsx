import React from 'react';
import { Ministry } from '../../types';
import { Music, Flame, HeartHandshake, Globe, Users, Heart, ArrowRight } from 'lucide-react';

interface MinistryCardProps {
  ministry: Ministry;
  onExplore?: (ministry: Ministry) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Music: <Music className="w-5 h-5 text-gold" />,
  Flame: <Flame className="w-5 h-5 text-gold" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5 text-gold" />,
  Globe: <Globe className="w-5 h-5 text-gold" />,
  Users: <Users className="w-5 h-5 text-gold" />,
  Heart: <Heart className="w-5 h-5 text-gold" />,
};

export const MinistryCard: React.FC<MinistryCardProps> = ({ ministry, onExplore }) => {
  return (
    <div className="bg-white rounded-md overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full group">
      <div className="relative aspect-16/10 overflow-hidden">
        <img
          src={ministry.imageUrl}
          alt={ministry.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center space-x-2">
          <div className="w-9 h-9 rounded-full bg-navy/90 border border-gold/40 flex items-center justify-center shrink-0">
            {iconMap[ministry.iconName] || <Users className="w-5 h-5 text-gold" />}
          </div>
          <h3 className="text-lg font-black uppercase text-white truncate drop-shadow-sm">
            {ministry.name}
          </h3>
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <p className="text-xs font-bold text-gold uppercase tracking-wider mb-2">
            {ministry.tagline}
          </p>
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
            {ministry.description}
          </p>

          <div className="bg-slate-50 p-3 rounded-xs mb-4 text-xs text-slate-700">
            <div className="font-bold text-navy">Meeting Time:</div>
            <div>{ministry.meetingTime}</div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 italic">
            Led by {typeof ministry.leader === 'string' ? ministry.leader : ministry.leader?.name}
          </span>
          <button
            onClick={() => onExplore && onExplore(ministry)}
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-navy hover:text-gold transition-colors cursor-pointer"
          >
            Explore <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
