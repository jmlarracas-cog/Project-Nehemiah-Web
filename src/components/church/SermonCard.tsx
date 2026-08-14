import React from 'react';
import { Sermon } from '../../types';
import { Play, Calendar, User, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';

interface SermonCardProps {
  sermon: Sermon;
  featured?: boolean;
  onWatch?: (sermon: Sermon) => void;
}

export const SermonCard: React.FC<SermonCardProps> = ({ sermon, featured = false, onWatch }) => {
  if (featured) {
    return (
      <div className="bg-navy text-white rounded-md overflow-hidden shadow-xl border border-navy-dark grid md:grid-cols-12 gap-0">
        <div className="md:col-span-7 relative group overflow-hidden min-h-[300px]">
          <img
            src={sermon.thumbnailUrl}
            alt={sermon.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/20 transition-colors flex items-center justify-center">
            <button
              onClick={() => onWatch && onWatch(sermon)}
              className="w-16 h-16 rounded-full bg-gold text-primary flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 cursor-pointer"
              aria-label={`Play ${sermon.title}`}
            >
              <Play className="w-8 h-8 ml-1 fill-current" />
            </button>
          </div>
          <span className="absolute top-4 left-4 bg-gold text-primary text-xs font-black uppercase tracking-widest px-3 py-1 rounded-sm shadow-md">
            FEATURED SERMON
          </span>
        </div>

        <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center text-gold text-xs font-bold uppercase tracking-widest mb-2">
              <BookOpen className="w-3.5 h-3.5 mr-1" />
              <span>{typeof sermon.series === 'string' ? sermon.series : sermon.series?.title}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-3 leading-tight">
              {sermon.title}
            </h3>
            <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-gray-300 mb-4">
              <span className="flex items-center">
                <User className="w-3.5 h-3.5 mr-1 text-gold" />
                {typeof sermon.speaker === 'string' ? sermon.speaker : sermon.speaker?.name}
              </span>
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-gold" />
                {sermon.date}
              </span>
            </div>
            <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed mb-6">
              {sermon.description}
            </p>
          </div>

          <div>
            <div className="text-xs text-gold font-semibold mb-4">
              Scripture Passage: <span className="text-white italic">{typeof sermon.scripture === 'string' ? sermon.scripture : sermon.scripture?.reference}</span>
            </div>
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
              onClick={() => onWatch && onWatch(sermon)}
            >
              <Play className="w-4 h-4 mr-2 fill-current" />
              WATCH SERMON
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full group">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={sermon.thumbnailUrl}
          alt={sermon.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-navy/30 group-hover:bg-navy/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
          <button
            onClick={() => onWatch && onWatch(sermon)}
            className="w-12 h-12 rounded-full bg-gold text-primary flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110 cursor-pointer"
            aria-label={`Play ${sermon.title}`}
          >
            <Play className="w-6 h-6 ml-0.5 fill-current" />
          </button>
        </div>
        <span className="absolute top-3 left-3 bg-navy text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-xs">
          {typeof sermon.series === 'string' ? sermon.series : sermon.series?.title}
        </span>
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <div className="text-xs text-slate-500 mb-1 flex justify-between items-center">
            <span>{sermon.date}</span>
            {sermon.duration && <span>{sermon.duration}</span>}
          </div>
          <h4 className="text-lg font-bold text-slate-900 group-hover:text-gold transition-colors mb-2 line-clamp-2">
            {sermon.title}
          </h4>
          <p className="text-xs text-slate-600 mb-3 font-medium">
            {typeof sermon.speaker === 'string' ? sermon.speaker : sermon.speaker?.name}
          </p>
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {sermon.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 italic font-serif">
            {typeof sermon.scripture === 'string' ? sermon.scripture : sermon.scripture?.reference}
          </span>
          <button
            onClick={() => onWatch && onWatch(sermon)}
            className="text-xs font-bold text-navy hover:text-gold uppercase tracking-wider flex items-center cursor-pointer"
          >
            Watch <Play className="w-3 h-3 ml-1 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
