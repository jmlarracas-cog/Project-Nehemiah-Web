import React, { useState, useEffect } from 'react';
import { Container } from '../components/ui/Container';
import { SearchInput } from '../components/search/SearchInput';
import { SearchResults } from '../components/search/SearchResults';
import { searchSiteContent } from '../services/searchService';
import { SearchResultCategory, SearchGroupedResults } from '../types/search';
import { Search } from 'lucide-react';

export const SearchPage: React.FC = () => {
  // Extract query from URL ?q= parameter
  const getUrlQuery = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  };

  const [query, setQuery] = useState<string>(getUrlQuery);
  const [activeCategory, setActiveCategory] = useState<SearchResultCategory | 'all'>('all');
  const [results, setResults] = useState<SearchGroupedResults>(() =>
    searchSiteContent(getUrlQuery(), 'all')
  );

  // Update query when window URL changes (e.g., navigation)
  useEffect(() => {
    const handlePopState = () => {
      const q = getUrlQuery();
      setQuery(q);
      setResults(searchSiteContent(q, activeCategory));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeCategory]);

  // Perform search and sync URL state when query changes
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setResults(searchSiteContent(newQuery, activeCategory));

    // Update URL query string without page reload
    const url = new URL(window.location.href);
    if (newQuery) {
      url.searchParams.set('q', newQuery);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());
  };

  const handleSelectResult = (path: string) => {
    if (path.startsWith('/search?q=')) {
      const q = decodeURIComponent(path.replace('/search?q=', ''));
      handleQueryChange(q);
      return;
    }

    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20" id="search-page">
      {/* Header Banner */}
      <section className="bg-navy text-white pt-12 pb-16 border-b border-navy-light" id="search-page-hero">
        <Container size="wide">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-navy-dark border border-gold/30 rounded-full text-gold text-xs font-semibold uppercase tracking-wider">
              <Search className="w-3.5 h-3.5" />
              <span>Church Directory & Knowledge Search</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight text-white">
              SEARCH <span className="text-gold">CHURCH OF GOD – SUBIC</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Find Sunday sermons, sermon series, church events, local campus locations, active ministries, and visitor information across our digital ministry platform.
            </p>

            <div className="pt-4 max-w-2xl mx-auto">
              <SearchInput
                value={query}
                onChange={handleQueryChange}
                placeholder="Search sermons, events, ministries, scripture, locations..."
                autoFocus
                id="search-page-input"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Main Results Section */}
      <section className="pt-10" id="search-page-results-section">
        <Container size="wide">
          <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <SearchResults
              searchResults={results}
              activeCategory={activeCategory}
              onCategorySelect={setActiveCategory}
              onSelectResult={handleSelectResult}
              id="search-page-results"
            />
          </div>
        </Container>
      </section>
    </div>
  );
};
