import React from 'react';
import { Play, Calendar, Clock, BookOpen, User, Sparkles, FileText } from 'lucide-react';
import { Sermon } from '../../types/sermon';
import { Button } from '../ui/Button';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface FeaturedSermonProps {
  sermon: Sermon;
  onSelectSermon?: (slug: string) => void;
}

export const FeaturedSermon: React.FC<FeaturedSermonProps> = ({
  sermon,
  onSelectSermon,
}) => {
  const speakerName = typeof sermon.speaker === 'string' ? sermon.speaker : sermon.speaker.name;
  const seriesTitle = typeof sermon.series === 'string' ? sermon.series : sermon.series.title;

  const handleNavigate = () => {
    if (onSelectSermon) {
      onSelectSermon(sermon.slug);
    } else {
      window.location.href = `/sermons/${sermon.slug}`;
    }
  };

  return (
    <section className="bg-navy relative overflow-hidden py-12 sm:py-16 border-b border-gold/20 text-white">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header Eyebrow */}
        <div className="flex items-center justify-between mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/40 text-gold text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>FEATURED SUNDAY MESSAGE</span>
          </div>

          <ContentVerificationBadge
            status={sermon.status}
            verifiedAt={sermon.meta?.verifiedAt}
            verifiedBy={sermon.meta?.verifiedBy}
            notes={sermon.meta?.notes}
          />
        </div>

        {/* Featured Card Main Layout */}
        <div className="bg-navy-light/90 border border-gold/30 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0 group">
          {/* Left / Top: Thumbnail & Video Trigger */}
          <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[360px] lg:min-h-[460px] overflow-hidden bg-slate-950">
            <img
              src={sermon.thumbnailUrl}
              alt={sermon.thumbnailAlt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-90"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-navy/80" />

            {/* Play Button Overlay */}
            <button
              onClick={handleNavigate}
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-gold/90 hover:bg-gold text-navy flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 group-hover:shadow-gold/30 focus:outline-none focus:ring-4 focus:ring-gold/50 cursor-pointer"
              aria-label={`Watch sermon: ${sermon.title}`}
            >
              <Play className="w-9 h-9 fill-navy ml-1" />
            </button>

            {/* Series Pill Floating */}
            <div className="absolute top-4 left-4 bg-navy/90 backdrop-blur-md text-gold border border-gold/40 text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-lg shadow-lg">
              {seriesTitle}
            </div>

            {/* Duration Badge */}
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center space-x-1.5 border border-white/10">
              <Clock className="w-3.5 h-3.5 text-gold" />
              <span>{sermon.duration}</span>
            </div>
          </div>

          {/* Right / Bottom: Content Details */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              {/* Category & Date */}
              <div className="flex items-center space-x-3 text-xs font-bold text-gold uppercase tracking-widest mb-3">
                <span>{sermon.category}</span>
                <span>•</span>
                <span className="flex items-center text-slate-300 normal-case font-medium">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-gold" />
                  {sermon.date}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-tight mb-3 font-sans group-hover:text-gold transition-colors">
                <a href={`/sermons/${sermon.slug}`}>{sermon.title}</a>
              </h2>

              {sermon.subtitle && (
                <p className="text-sm font-semibold text-gold/90 mb-4 italic font-serif">
                  {sermon.subtitle}
                </p>
              )}

              {/* Speaker & Scripture Badges */}
              <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-200 mb-5">
                <div className="inline-flex items-center space-x-1.5 bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg">
                  <User className="w-3.5 h-3.5 text-gold" />
                  <span>{speakerName}</span>
                </div>

                <div className="inline-flex items-center space-x-1.5 bg-gold/15 border border-gold/30 text-gold font-bold px-3 py-1.5 rounded-lg">
                  <BookOpen className="w-3.5 h-3.5 text-gold" />
                  <span>{sermon.scripture.reference}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-6 line-clamp-4">
                {sermon.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                onClick={handleNavigate}
                icon={Play}
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                WATCH SERMON
              </Button>

              <Button
                variant="outline"
                onClick={handleNavigate}
                icon={FileText}
                iconPosition="left"
                className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10"
              >
                NOTES & DETAILS
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
