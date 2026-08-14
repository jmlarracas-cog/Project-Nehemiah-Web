import React, { useState, useMemo } from 'react';
import { Sermon, SermonSeries, SermonSpeaker } from '../../types/sermon';
import { SermonCard } from './SermonCard';
import { SermonFilter } from './SermonFilter';
import { SermonSearch } from './SermonSearch';
import { Tv, Sparkles } from 'lucide-react';

interface SermonGridProps {
  sermons: Sermon[];
  categories: string[];
  seriesList: SermonSeries[];
  speakersList: SermonSpeaker[];
  onSelectSermon?: (slug: string) => void;
}

export const SermonGrid: React.FC<SermonGridProps> = ({
  sermons,
  categories,
  seriesList,
  speakersList,
  onSelectSermon,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All Categories');
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const hasActiveFilters = useMemo(() => {
    return (
      activeCategory !== 'All Categories' ||
      selectedSeriesId !== '' ||
      selectedSpeakerId !== '' ||
      searchQuery.trim() !== ''
    );
  }, [activeCategory, selectedSeriesId, selectedSpeakerId, searchQuery]);

  const handleResetFilters = () => {
    setActiveCategory('All Categories');
    setSelectedSeriesId('');
    setSelectedSpeakerId('');
    setSearchQuery('');
  };

  const filteredSermons = useMemo(() => {
    return sermons.filter((sermon) => {
      // Category Filter
      if (activeCategory !== 'All Categories' && sermon.category !== activeCategory) {
        return false;
      }

      // Series Filter
      if (selectedSeriesId) {
        const sermonSeriesId =
          typeof sermon.series === 'string' ? sermon.series : sermon.series.id;
        if (sermon.seriesId !== selectedSeriesId && sermonSeriesId !== selectedSeriesId) {
          return false;
        }
      }

      // Speaker Filter
      if (selectedSpeakerId) {
        const sermonSpeakerId =
          typeof sermon.speaker === 'string' ? sermon.speaker : sermon.speaker.id;
        if (sermon.speakerId !== selectedSpeakerId && sermonSpeakerId !== selectedSpeakerId) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const speakerName = typeof sermon.speaker === 'string' ? sermon.speaker : sermon.speaker.name;
        const seriesTitle = typeof sermon.series === 'string' ? sermon.series : sermon.series.title;

        const matchTitle = sermon.title.toLowerCase().includes(q);
        const matchSpeaker = speakerName.toLowerCase().includes(q);
        const matchSeries = seriesTitle.toLowerCase().includes(q);
        const matchScripture =
          sermon.scripture.reference.toLowerCase().includes(q) ||
          (sermon.scripture.text && sermon.scripture.text.toLowerCase().includes(q));
        const matchDescription = sermon.description.toLowerCase().includes(q);
        const matchTags = sermon.tags.some((tag) => tag.toLowerCase().includes(q));

        if (
          !matchTitle &&
          !matchSpeaker &&
          !matchSeries &&
          !matchScripture &&
          !matchDescription &&
          !matchTags
        ) {
          return false;
        }
      }

      return true;
    });
  }, [sermons, activeCategory, selectedSeriesId, selectedSpeakerId, searchQuery]);

  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Filter Header */}
        <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-navy tracking-tight">
                Sermon Media Library
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Search and filter past Sunday messages, Bible studies, and special teachings.
              </p>
            </div>

            <div className="w-full md:w-80">
              <SermonSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            </div>
          </div>

          {/* Filter Bar */}
          <SermonFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            seriesList={seriesList}
            selectedSeriesId={selectedSeriesId}
            onSelectSeries={setSelectedSeriesId}
            speakersList={speakersList}
            selectedSpeakerId={selectedSpeakerId}
            onSelectSpeaker={setSelectedSpeakerId}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 font-semibold px-1">
          <span>
            Showing <strong className="text-navy font-black">{filteredSermons.length}</strong> {filteredSermons.length === 1 ? 'sermon' : 'sermons'}
          </span>

          {hasActiveFilters && (
            <span className="text-gold-dark font-bold">
              Filters applied
            </span>
          )}
        </div>

        {/* Sermon Grid */}
        {filteredSermons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredSermons.map((sermon) => (
              <SermonCard
                key={sermon.id}
                sermon={sermon}
                onSelectSermon={onSelectSermon}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 my-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Tv className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black uppercase text-navy tracking-tight">
              No Sermons Found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              We couldn't find any sermons matching your current search query or filter selection. Try adjusting your filters or search keywords.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-navy text-gold text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-navy-light transition-colors cursor-pointer inline-flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
