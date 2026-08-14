import React, { useState } from 'react';
import { Ministry, MinistryCategory } from '../../types/ministry';
import { MinistryCard } from './MinistryCard';
import { MinistryCategoryFilter } from './MinistryCategoryFilter';
import { SectionHeader } from '../ui/SectionHeader';
import { Search, Sparkles } from 'lucide-react';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface MinistryGridProps {
  ministries: Ministry[];
  categories: MinistryCategory[];
  onSelectMinistry: (ministry: Ministry) => void;
}

export const MinistryGrid: React.FC<MinistryGridProps> = ({
  ministries,
  categories,
  onSelectMinistry,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter Logic
  const filteredMinistries = ministries.filter((min) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      min.category.toLowerCase() === selectedCategory.toLowerCase() ||
      categories.find((c) => c.id === selectedCategory)?.name.toLowerCase() === min.category.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === '' ||
      min.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      min.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (min.category && min.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const sortedMinistries = [...filteredMinistries].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="FIND YOUR PLACE"
          title="EXPLORE OUR MINISTRIES"
          subtitle="Discover opportunities to connect, worship, serve, and disciple across all generations."
          centered
        />

        <div className="mt-8 mb-4 flex justify-center">
          <ContentVerificationBadge
            status="pending_verification"
            label="DEMO CATALOG — PENDING OFFICIAL CHURCH CHARTER VERIFICATION"
          />
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto flex-1">
            <MinistryCategoryFilter
              categories={categories}
              activeCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Quick Keyword Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ministries..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium rounded-xl bg-white border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-gold focus:border-navy text-navy placeholder:text-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Ministry Cards Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        {sortedMinistries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {sortedMinistries.map((ministry) => (
              <MinistryCard
                key={ministry.id}
                ministry={ministry}
                onSelect={onSelectMinistry}
              />
            ))}
          </div>
        ) : (
          /* Empty Search Results Fallback */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-lg font-black uppercase text-navy mb-2">
              No Ministries Found
            </h3>
            <p className="text-xs text-slate-600 mb-6">
              No results match your search term or category filter. Try clearing filters or searching for another key phrase.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg bg-navy text-gold text-xs font-black uppercase tracking-wider hover:bg-navy-dark transition-colors"
            >
              RESET ALL FILTERS
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
