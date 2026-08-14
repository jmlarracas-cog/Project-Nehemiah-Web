import React from 'react';
import {
  SearchResultItem,
  SearchResultCategory,
  SearchGroupedResults,
} from '../../types/search';
import {
  BookOpen,
  Calendar,
  Heart,
  MapPin,
  FileText,
  HelpCircle,
  User,
  ArrowRight,
  SearchX,
} from 'lucide-react';

interface SearchResultsProps {
  searchResults: SearchGroupedResults;
  activeCategory: SearchResultCategory | 'all';
  onCategorySelect: (category: SearchResultCategory | 'all') => void;
  onSelectResult: (path: string) => void;
  id?: string;
}

const categoryIcons: Record<SearchResultCategory, React.ReactNode> = {
  page: <FileText className="w-4 h-4 text-blue-600" />,
  sermon: <BookOpen className="w-4 h-4 text-purple-600" />,
  event: <Calendar className="w-4 h-4 text-amber-600" />,
  ministry: <Heart className="w-4 h-4 text-rose-600" />,
  church: <MapPin className="w-4 h-4 text-emerald-600" />,
  faq: <HelpCircle className="w-4 h-4 text-cyan-600" />,
  visitor: <User className="w-4 h-4 text-indigo-600" />,
};

const categoryBadges: Record<SearchResultCategory, { bg: string; text: string }> = {
  page: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800' },
  sermon: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-800' },
  event: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800' },
  ministry: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-800' },
  church: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800' },
  faq: { bg: 'bg-cyan-50 border-cyan-200', text: 'text-cyan-800' },
  visitor: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-800' },
};

export const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  activeCategory,
  onCategorySelect,
  onSelectResult,
  id = 'global-search-results',
}) => {
  const { query, totalCount, results, byCategory } = searchResults;

  if (!query) {
    return (
      <div className="py-12 px-4 text-center text-slate-500" id={`${id}-empty`}>
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <BookOpen className="w-6 h-6 text-gold-dark" />
        </div>
        <p className="text-sm font-semibold text-navy">Type to search Church of God – Subic</p>
        <p className="text-xs text-slate-500 mt-1">
          Search for Sunday sermons, church events, active ministries, campus locations, or visitor guides.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-md mx-auto">
          {['Nehemiah', 'Sunday Worship', 'Youth Conference', 'Olongapo', 'Prayer Request', 'Visitor Guide'].map(
            (suggestion) => (
              <span
                key={suggestion}
                className="inline-block px-2.5 py-1 text-xs bg-slate-100 hover:bg-gold/20 text-navy rounded-md transition-colors cursor-pointer"
                onClick={() => onSelectResult(`/search?q=${encodeURIComponent(suggestion)}`)}
              >
                {suggestion}
              </span>
            )
          )}
        </div>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="py-12 px-4 text-center text-slate-500" id={`${id}-no-results`}>
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <SearchX className="w-6 h-6 text-slate-400" />
        </div>
        <h4 className="text-base font-semibold text-navy">No results found for "{query}"</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          We couldn't find matching sermons, ministries, or events. Please check your spelling or try broader keywords.
        </p>
      </div>
    );
  }

  const categoryTabs: { key: SearchResultCategory | 'all'; label: string; count: number }[] = [
    { key: 'all' as const, label: 'All Results', count: totalCount },
    { key: 'sermon' as const, label: 'Sermons', count: byCategory.sermon.length },
    { key: 'event' as const, label: 'Events', count: byCategory.event.length },
    { key: 'ministry' as const, label: 'Ministries', count: byCategory.ministry.length },
    { key: 'church' as const, label: 'Locations', count: byCategory.church.length },
    { key: 'page' as const, label: 'Pages', count: byCategory.page.length },
    { key: 'visitor' as const, label: 'Visitor Guide', count: byCategory.visitor.length + byCategory.faq.length },
  ].filter((tab) => tab.key === 'all' || tab.count > 0);

  return (
    <div className="flex flex-col h-full" id={id}>
      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-3 border-b border-slate-100 no-scrollbar">
        {categoryTabs.map((tab) => {
          const isActive = activeCategory === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onCategorySelect(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-navy text-gold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>

      {/* Results List */}
      <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-1">
        {results.map((item) => {
          const badgeStyle = categoryBadges[item.category] || categoryBadges.page;
          const icon = categoryIcons[item.category];

          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectResult(item.path)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectResult(item.path);
                }
              }}
              className="group p-3.5 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-gold/50 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gold"
              id={`result-${item.id}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:border-gold/30 transition-colors">
                    {icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeStyle.bg} ${badgeStyle.text}`}>
                        {item.categoryLabel}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-navy group-hover:text-gold-dark transition-colors mt-1">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {item.description}
                    </p>

                    {item.snippet && (
                      <p className="text-[11px] text-slate-500 italic mt-1.5 bg-slate-50 p-1.5 rounded border border-slate-100">
                        {item.snippet}
                      </p>
                    )}

                    {(item.speaker || item.scripture || item.date || item.location) && (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mt-2 font-medium">
                        {item.speaker && <span>Speaker: {item.speaker}</span>}
                        {item.scripture && <span>Scripture: {item.scripture}</span>}
                        {item.date && <span>Date: {item.date}</span>}
                        {item.location && <span>Location: {item.location}</span>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-slate-400 group-hover:text-gold-dark transition-colors p-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
