import React from 'react';
import { Search, X } from 'lucide-react';

interface EventSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

export const EventSearch: React.FC<EventSearchProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Search by title, category, location, or tag...',
}) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto my-4">
      <label htmlFor="event-search-input" className="sr-only">
        Search events and gatherings
      </label>
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          id="event-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy shadow-sm transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-navy"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
