import React from 'react';
import { Filter, RotateCcw, Layers, User } from 'lucide-react';
import { SermonSeries, SermonSpeaker } from '../../types/sermon';

interface SermonFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  seriesList: SermonSeries[];
  selectedSeriesId: string;
  onSelectSeries: (seriesId: string) => void;
  speakersList: SermonSpeaker[];
  selectedSpeakerId: string;
  onSelectSpeaker: (speakerId: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const SermonFilter: React.FC<SermonFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  seriesList,
  selectedSeriesId,
  onSelectSeries,
  speakersList,
  selectedSpeakerId,
  onSelectSpeaker,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Category Pills Bar */}
      <div className="w-full overflow-x-auto pb-2 no-scrollbar">
        <div
          className="flex items-center space-x-2 min-w-max bg-slate-100 p-1.5 rounded-xl border border-slate-200"
          role="tablist"
          aria-label="Sermon categories filter"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold ${
                  isActive
                    ? 'bg-navy text-gold shadow-md border border-gold/40'
                    : 'text-slate-700 hover:text-navy hover:bg-white/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Dropdown Selects for Series, Speaker & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
        <div className="flex items-center space-x-2 text-xs font-bold text-navy uppercase tracking-wider shrink-0 mr-2">
          <Filter className="w-4 h-4 text-gold-dark" />
          <span>Filter By:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          {/* Series Dropdown */}
          <div className="relative min-w-[180px] flex-1 sm:flex-initial">
            <label htmlFor="series-select" className="sr-only">Filter by Series</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <select
              id="series-select"
              value={selectedSeriesId}
              onChange={(e) => onSelectSeries(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-gold focus:border-navy appearance-none cursor-pointer"
            >
              <option value="">All Series</option>
              {seriesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Speaker Dropdown */}
          <div className="relative min-w-[180px] flex-1 sm:flex-initial">
            <label htmlFor="speaker-select" className="sr-only">Filter by Speaker</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-3.5 h-3.5" />
            </div>
            <select
              id="speaker-select"
              value={selectedSpeakerId}
              onChange={(e) => onSelectSpeaker(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-gold focus:border-navy appearance-none cursor-pointer"
            >
              <option value="">All Speakers</option>
              {speakersList.map((spk) => (
                <option key={spk.id} value={spk.id}>
                  {spk.name} ({spk.title})
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
