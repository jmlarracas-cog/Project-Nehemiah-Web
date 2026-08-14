import React from 'react';
import { Ministry } from '../../types/ministry';
import {
  Music,
  Flame,
  Users,
  HeartHandshake,
  Globe,
  Heart,
  BookOpen,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface MinistryCardProps {
  ministry: Ministry;
  onSelect?: (ministry: Ministry) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Music: <Music className="w-5 h-5 text-gold" />,
  Flame: <Flame className="w-5 h-5 text-gold" />,
  Users: <Users className="w-5 h-5 text-gold" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5 text-gold" />,
  Globe: <Globe className="w-5 h-5 text-gold" />,
  Heart: <Heart className="w-5 h-5 text-gold" />,
  BookOpen: <BookOpen className="w-5 h-5 text-gold" />,
};

export const MinistryCard: React.FC<MinistryCardProps> = ({ ministry, onSelect }) => {
  const isPending = ministry.status === 'pending_verification';

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col h-full group hover:-translate-y-1 relative">
      {/* Card Header Image / Fallback Container */}
      <div className="relative aspect-16/10 overflow-hidden bg-navy">
        {ministry.imageUrl ? (
          <img
            src={ministry.imageUrl}
            alt={ministry.imageAlt || ministry.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Polished Empty/Missing Image Fallback */
          <div className="w-full h-full bg-navy-dark flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent opacity-50" />
            <div className="w-14 h-14 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mb-3 text-gold">
              {iconMap[ministry.iconName || ''] || <Sparkles className="w-6 h-6 text-gold" />}
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-gold/80 block">
              CHURCH OF GOD SUBIC
            </span>
            <h4 className="text-base font-black uppercase text-white tracking-tight mt-1">
              {ministry.name}
            </h4>
          </div>
        )}

        {/* Gradient Overlay for Image */}
        {ministry.imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
        )}

        {/* Category Pill & Verification Badge overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gold bg-navy/90 border border-gold/30 px-3 py-1 rounded-full shadow-sm backdrop-blur-xs">
            {ministry.category}
          </span>

          {isPending && (
            <ContentVerificationBadge
              status="pending_verification"
              compact
              label="DEMO"
            />
          )}
        </div>

        {/* Title & Icon Overlay at bottom of header */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center space-x-2 z-10">
          <div className="w-9 h-9 rounded-full bg-navy border border-gold/40 flex items-center justify-center shrink-0 shadow-md">
            {iconMap[ministry.iconName || ''] || <Users className="w-5 h-5 text-gold" />}
          </div>
          <h3 className="text-lg font-black uppercase text-white truncate drop-shadow-sm tracking-tight">
            {ministry.name}
          </h3>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
        <div>
          {/* Tagline */}
          {ministry.tagline && (
            <p className="text-[11px] font-black text-gold uppercase tracking-widest mb-2">
              {ministry.tagline}
            </p>
          )}

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
            {ministry.shortDescription || ministry.description}
          </p>

          {/* Schedule & Meeting Info Box */}
          {ministry.meetingSchedule && (
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-lg text-xs space-y-1.5 mb-3">
              <div className="flex items-center text-navy font-bold">
                <Clock className="w-3.5 h-3.5 text-gold mr-1.5 shrink-0" />
                <span>{ministry.meetingSchedule.day || 'Schedule Pending'} • {ministry.meetingSchedule.time}</span>
              </div>
              {ministry.meetingSchedule.location && (
                <div className="flex items-center text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                  <span className="truncate">{ministry.meetingSchedule.location}</span>
                </div>
              )}
            </div>
          )}

          {/* Scripture Reference */}
          {ministry.scripture && (
            <div className="flex items-center text-[11px] font-bold text-navy uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5 text-gold mr-1.5 shrink-0" />
              <span>{ministry.scripture.reference}</span>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-auto">
          {ministry.leader ? (
            <div className="flex items-center space-x-1.5 text-slate-600 truncate max-w-[170px]">
              <UserCheck className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="truncate font-medium">{ministry.leader.name}</span>
            </div>
          ) : (
            <span className="text-slate-400 italic text-[11px]">Leader Pending</span>
          )}

          <button
            onClick={() => onSelect && onSelect(ministry)}
            className="inline-flex items-center text-xs font-black uppercase tracking-wider text-navy group-hover:text-gold transition-colors cursor-pointer py-1 px-2 rounded-md hover:bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-gold"
            aria-label={`Learn more about ${ministry.name}`}
          >
            <span>LEARN MORE</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  );
};
