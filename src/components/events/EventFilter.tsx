import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export type TimeFilterMode = 'upcoming' | 'past' | 'all';

interface EventFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  timeMode: TimeFilterMode;
  onTimeModeChange: (mode: TimeFilterMode) => void;
  onReset: () => void;
  activeFilterCount: number;
}

export const EventFilter: React.FC<EventFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  timeMode,
  onTimeModeChange,
  onReset,
  activeFilterCount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-5 my-6">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-navy font-bold text-base">
          <Filter className="w-5 h-5 text-gold" />
          <span>Filter Events</span>
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-navy text-gold rounded-full font-bold">
              {activeFilterCount} Active
            </span>
          )}
        </div>

        {/* Time Filter Tabs (Upcoming / Past / All) */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl space-x-1">
          {(
            [
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'all', label: 'All Events' },
              { id: 'past', label: 'Past Events' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTimeModeChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeMode === tab.id
                  ? 'bg-navy text-gold shadow-sm'
                  : 'text-slate-600 hover:text-navy hover:bg-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-navy border-navy text-gold shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Button if filters active */}
      {activeFilterCount > 0 && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET FILTERS</span>
          </button>
        </div>
      )}
    </div>
  );
};
