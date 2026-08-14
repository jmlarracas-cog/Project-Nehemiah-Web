import React from 'react';
import { Play, Calendar, Clock, BookOpen, User } from 'lucide-react';
import { Sermon } from '../../types/sermon';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface SermonCardProps {
  sermon: Sermon;
  onSelectSermon?: (slug: string) => void;
  variant?: 'normal' | 'compact';
}

export const SermonCard: React.FC<SermonCardProps> = ({
  sermon,
  onSelectSermon,
  variant = 'normal',
}) => {
  const speakerName = typeof sermon.speaker === 'string' ? sermon.speaker : sermon.speaker.name;
  const seriesTitle = typeof sermon.series === 'string' ? sermon.series : sermon.series.title;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectSermon) {
      onSelectSermon(sermon.slug);
    } else {
      window.location.href = `/sermons/${sermon.slug}`;
    }
  };

  if (variant === 'compact') {
    return (
      <a
        href={`/sermons/${sermon.slug}`}
        onClick={handleClick}
        className="group flex items-center space-x-4 p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-md"
      >
        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-900">
          <img
            src={sermon.thumbnailUrl}
            alt={sermon.thumbnailAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/40 transition-colors flex items-center justify-center">
            <Play className="w-6 h-6 text-gold fill-gold opacity-90 group-hover:scale-110 transition-transform" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider block truncate">
            {seriesTitle}
          </span>
          <h4 className="text-sm font-black text-navy uppercase tracking-tight group-hover:text-gold transition-colors truncate">
            {sermon.title}
          </h4>
          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
            {speakerName} • {sermon.scripture.reference}
          </p>
        </div>
      </a>
    );
  }

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:border-gold/50">
      {/* Thumbnail Area */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={sermon.thumbnailUrl}
          alt={sermon.thumbnailAlt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out filter brightness-95"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Play Icon Hover Overlay */}
        <a
          href={`/sermons/${sermon.slug}`}
          onClick={handleClick}
          className="absolute inset-0 flex items-center justify-center bg-navy/30 opacity-0 group-hover:opacity-100 transition-all duration-300"
          aria-label={`Watch ${sermon.title}`}
        >
          <div className="w-14 h-14 rounded-full bg-gold text-navy flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-7 h-7 fill-navy ml-1" />
          </div>
        </a>

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="bg-navy/90 backdrop-blur-md text-gold border border-gold/40 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
            {seriesTitle}
          </span>

          {sermon.status === 'pending_verification' && (
            <div className="pointer-events-auto">
              <ContentVerificationBadge
                status={sermon.status}
                verifiedAt={sermon.meta?.verifiedAt}
                verifiedBy={sermon.meta?.verifiedBy}
                notes={sermon.meta?.notes}
                className="scale-90 origin-top-right"
              />
            </div>
          )}
        </div>

        {/* Bottom Duration Badge */}
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center space-x-1 border border-white/10">
          <Clock className="w-3 h-3 text-gold" />
          <span>{sermon.duration}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Date */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold text-gold-dark uppercase tracking-wider">
              {sermon.category}
            </span>
            <span className="flex items-center font-medium">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {sermon.date}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-black uppercase text-navy tracking-tight leading-snug mb-2 font-sans group-hover:text-gold transition-colors line-clamp-2">
            <a href={`/sermons/${sermon.slug}`} onClick={handleClick}>
              {sermon.title}
            </a>
          </h3>

          {/* Speaker & Scripture */}
          <div className="space-y-1.5 mb-4 text-xs text-slate-600 font-medium">
            <div className="flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-navy shrink-0" />
              <span className="font-semibold text-slate-800">{speakerName}</span>
            </div>

            <div className="flex items-center space-x-1.5 text-slate-600">
              <BookOpen className="w-3.5 h-3.5 text-gold-dark shrink-0" />
              <span className="font-bold text-navy">{sermon.scripture.reference}</span>
            </div>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4 font-normal">
            {sermon.description}
          </p>
        </div>

        {/* Card Footer Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {sermon.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          <a
            href={`/sermons/${sermon.slug}`}
            onClick={handleClick}
            className="inline-flex items-center space-x-1 text-xs font-black uppercase tracking-wider text-navy group-hover:text-gold transition-colors"
          >
            <span>WATCH</span>
            <Play className="w-3.5 h-3.5 fill-current" />
          </a>
        </div>
      </div>
    </div>
  );
};
