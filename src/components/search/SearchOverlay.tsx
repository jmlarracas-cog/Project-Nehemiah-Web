import React, { useState, useEffect } from 'react';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { searchSiteContent } from '../../services/searchService';
import { SearchResultCategory, SearchGroupedResults } from '../../types/search';
import { X, ExternalLink } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  initialQuery?: string;
  id?: string;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  onNavigate,
  initialQuery = '',
  id = 'global-search-overlay',
}) => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [activeCategory, setActiveCategory] = useState<SearchResultCategory | 'all'>('all');
  const [results, setResults] = useState<SearchGroupedResults>(() =>
    searchSiteContent(initialQuery, 'all')
  );

  // Sync initial query when opened
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setResults(searchSiteContent(initialQuery, activeCategory));
    }
  }, [isOpen, initialQuery]);

  // Handle live search input updates
  useEffect(() => {
    setResults(searchSiteContent(query, activeCategory));
  }, [query, activeCategory]);

  // Close on Escape & Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectResult = (path: string) => {
    onClose();
    onNavigate(path);
  };

  const handleFullSearchPage = () => {
    onClose();
    if (query) {
      onNavigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      onNavigate('/search');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 px-4 bg-navy-dark/80 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-heading`}
      id={id}
    >
      {/* Overlay Backdrop Click */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content Box */}
      <div
        className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex-1">
            <SearchInput
              value={query}
              onChange={setQuery}
              autoFocus
              id={`${id}-input`}
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-navy hover:bg-slate-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Close search overlay"
            id={`${id}-close`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="p-4 overflow-y-auto flex-1">
          <SearchResults
            searchResults={results}
            activeCategory={activeCategory}
            onCategorySelect={setActiveCategory}
            onSelectResult={handleSelectResult}
            id={`${id}-results-list`}
          />
        </div>

        {/* Footer Bar */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px] text-navy shadow-xs">
              ESC
            </kbd>
            <span>to close</span>
          </div>

          {query && (
            <button
              type="button"
              onClick={handleFullSearchPage}
              className="flex items-center gap-1.5 font-bold text-navy hover:text-gold-dark transition-colors"
            >
              <span>View full search page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
