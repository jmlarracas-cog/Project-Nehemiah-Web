import React from 'react';
import { ChurchLocation } from '../../types/church';
import { ChurchCard } from './ChurchCard';
import { MapPin, SearchX } from 'lucide-react';

interface ChurchGridProps {
  churches: ChurchLocation[];
  onResetFilters?: () => void;
}

export const ChurchGrid: React.FC<ChurchGridProps> = ({ churches, onResetFilters }) => {
  if (churches.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-4">
        <div className="w-12 h-12 bg-navy/10 text-navy rounded-full flex items-center justify-center mx-auto">
          <SearchX className="w-6 h-6 text-navy" />
        </div>
        <h3 className="text-lg font-black uppercase tracking-tight text-navy">
          No Church Locations Found
        </h3>
        <p className="text-slate-600 text-sm max-w-md mx-auto">
          No locations match your search or filter parameters. Try adjusting your query or resetting your search filters.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-navy text-gold font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-navy-light transition-colors"
          >
            Reset All Search Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {churches.map((church) => (
        <ChurchCard key={church.id} church={church} />
      ))}
    </div>
  );
};
