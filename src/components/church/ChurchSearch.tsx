import React from 'react';
import { Search, X } from 'lucide-react';

interface ChurchSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
}

export const ChurchSearch: React.FC<ChurchSearchProps> = ({
  searchTerm,
  onSearchChange,
  resultCount,
}) => {
  return (
    <div className="w-full">
      <label htmlFor="church-search-input" className="sr-only">
        Search church locations by name, city, municipality, or province
      </label>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 pointer-events-none text-slate-400">
          <Search className="w-4 h-4 text-slate-400" />
        </div>
        <input
          id="church-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by city, town (e.g. Subic, Olongapo, Castillejos) or keyword..."
          className="w-full pl-10 pr-24 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-all shadow-xs"
        />
        {searchTerm ? (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search input"
            className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <span className="absolute right-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 pointer-events-none">
            {resultCount} {resultCount === 1 ? 'Location' : 'Locations'}
          </span>
        )}
      </div>
    </div>
  );
};
