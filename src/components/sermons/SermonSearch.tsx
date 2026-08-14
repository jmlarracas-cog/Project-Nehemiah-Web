import React from 'react';
import { Search, X } from 'lucide-react';

interface SermonSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export const SermonSearch: React.FC<SermonSearchProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = 'Search sermons by title, speaker, scripture, series, or tags...',
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-5 h-5" />
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 bg-white text-navy placeholder:text-slate-400 text-sm font-medium border border-slate-300 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-gold focus:border-navy transition-all"
        aria-label="Search sermons"
      />

      {searchQuery && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
