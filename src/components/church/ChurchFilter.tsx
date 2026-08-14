import React from 'react';
import { Filter } from 'lucide-react';
import { ContentStatus } from '../../types/about';

interface ChurchFilterProps {
  selectedStatus: 'all' | ContentStatus;
  onStatusChange: (status: 'all' | ContentStatus) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  availableCities: string[];
}

export const ChurchFilter: React.FC<ChurchFilterProps> = ({
  selectedStatus,
  onStatusChange,
  selectedCity,
  onCityChange,
  availableCities,
}) => {
  return (
    <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-navy" />
            <span>Verification:</span>
          </span>
          <button
            type="button"
            onClick={() => onStatusChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              selectedStatus === 'all'
                ? 'bg-navy text-gold shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Locations
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              selectedStatus === 'published'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Verified Only
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('pending_verification')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              selectedStatus === 'pending_verification'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Pending Verification
          </button>
        </div>

        {/* City Filter Dropdown / Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">City / Municipality:</span>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-navy/30"
          >
            <option value="all">ALL MUNICIPALITIES</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};
