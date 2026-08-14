import React, { useState, useMemo } from 'react';
import { ChurchLocation } from '../../types/church';
import { ContentStatus } from '../../types/about';
import { ChurchSearch } from './ChurchSearch';
import { ChurchFilter } from './ChurchFilter';
import { ChurchGrid } from './ChurchGrid';
import { Container } from '../ui/Container';

interface ChurchDirectoryProps {
  churches: ChurchLocation[];
}

export const ChurchDirectory: React.FC<ChurchDirectoryProps> = ({ churches }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ContentStatus>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Extract unique available cities from churches data
  const availableCities = useMemo(() => {
    const citySet = new Set<string>();
    churches.forEach((c) => {
      if (c.city) citySet.add(c.city);
    });
    return Array.from(citySet).sort();
  }, [churches]);

  // Client-side search and filter logic
  const filteredChurches = useMemo(() => {
    return churches.filter((church) => {
      // 1. Status Filter
      if (selectedStatus !== 'all' && church.status !== selectedStatus) {
        return false;
      }

      // 2. City Filter
      if (selectedCity !== 'all' && church.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // 3. Keyword Search
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchName = church.name.toLowerCase().includes(query);
        const matchCity = church.city.toLowerCase().includes(query);
        const matchMunicipality = church.municipality?.toLowerCase().includes(query) || false;
        const matchProvince = church.province.toLowerCase().includes(query);
        const matchDesc = church.shortDescription.toLowerCase().includes(query);
        const matchLeader = church.leadership.name.toLowerCase().includes(query);

        if (!matchName && !matchCity && !matchMunicipality && !matchProvince && !matchDesc && !matchLeader) {
          return false;
        }
      }

      return true;
    });
  }, [churches, searchTerm, selectedStatus, selectedCity]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedCity('all');
  };

  return (
    <section className="py-12 sm:py-16 bg-white">
      <Container size="wide" className="space-y-8">
        
        {/* Search & Filter Header Section */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-navy uppercase tracking-tight">
                Church Directory & Locations
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm pt-0.5">
                Explore Church of God worship locations across Subic, Olongapo, and Zambales.
              </p>
            </div>

            {/* Reset Filters CTA if active filters */}
            {(searchTerm || selectedStatus !== 'all' || selectedCity !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-gold hover:text-navy uppercase tracking-wider underline transition-colors self-start md:self-auto"
              >
                Clear Active Filters
              </button>
            )}
          </div>

          {/* Search Bar Input */}
          <ChurchSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            resultCount={filteredChurches.length}
          />

          {/* Verification & Location Filters */}
          <ChurchFilter
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            availableCities={availableCities}
          />
        </div>

        {/* Directory Grid Display */}
        <ChurchGrid
          churches={filteredChurches}
          onResetFilters={handleResetFilters}
        />

      </Container>
    </section>
  );
};
