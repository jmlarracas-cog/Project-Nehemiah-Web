import React from 'react';
import { Sermon } from '../../types/sermon';
import { SermonCard } from './SermonCard';

interface RelatedSermonsProps {
  currentSermon: Sermon;
  allSermons: Sermon[];
  onSelectSermon?: (slug: string) => void;
}

export const RelatedSermons: React.FC<RelatedSermonsProps> = ({
  currentSermon,
  allSermons,
  onSelectSermon,
}) => {
  const currentSeriesId = typeof currentSermon.series === 'string' ? currentSermon.series : currentSermon.series.id;
  const currentSpeakerId = typeof currentSermon.speaker === 'string' ? currentSermon.speaker : currentSermon.speaker.id;

  // Filter out current sermon
  const otherSermons = allSermons.filter((s) => s.id !== currentSermon.id);

  // Score & sort related sermons
  const relatedSermons = [...otherSermons]
    .map((sermon) => {
      let score = 0;
      const sSeriesId = typeof sermon.series === 'string' ? sermon.series : sermon.series.id;
      const sSpeakerId = typeof sermon.speaker === 'string' ? sermon.speaker : sermon.speaker.id;

      if (sSeriesId === currentSeriesId) score += 3;
      if (sSpeakerId === currentSpeakerId) score += 2;
      if (sermon.category === currentSermon.category) score += 1;

      return { sermon, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.sermon)
    .slice(0, 3);

  if (relatedSermons.length === 0) return null;

  return (
    <section className="py-12 bg-slate-100 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-navy">
              More Messages You May Like
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Continue growing with related sermons from the same series or topic.
            </p>
          </div>

          <a
            href="/sermons"
            className="text-xs font-bold uppercase tracking-wider text-navy hover:text-gold transition-colors hidden sm:block"
          >
            View All Sermons →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedSermons.map((sermon) => (
            <SermonCard
              key={sermon.id}
              sermon={sermon}
              onSelectSermon={onSelectSermon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
