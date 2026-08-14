import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onClear?: () => void;
  onSubmit?: () => void;
  className?: string;
  id?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search sermons, ministries, events, location, or scripture...',
  autoFocus = true,
  onClear,
  onSubmit,
  className = '',
  id = 'global-search-input',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (value) {
        onChange('');
        if (onClear) onClear();
      }
    } else if (e.key === 'Enter') {
      if (onSubmit) onSubmit();
    }
  };

  return (
    <div className={`relative flex items-center w-full ${className}`} id={`${id}-wrapper`}>
      <div className="absolute left-4 text-navy-dark/60 pointer-events-none flex items-center justify-center">
        <Search className="w-5 h-5 text-gold-dark" />
      </div>

      <input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-300 rounded-xl text-navy font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold shadow-sm transition-all"
        aria-label="Search site content"
        autoComplete="off"
      />

      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            if (onClear) onClear();
            if (inputRef.current) inputRef.current.focus();
          }}
          className="absolute right-3.5 p-1.5 text-slate-400 hover:text-navy rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
          aria-label="Clear search input"
          id={`${id}-clear-button`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
