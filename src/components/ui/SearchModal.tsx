import React from 'react';
import { SearchOverlay } from '../search/SearchOverlay';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo(0, 0);
  };

  return (
    <SearchOverlay
      isOpen={isOpen}
      onClose={onClose}
      onNavigate={handleNavigate}
      id="legacy-search-modal"
    />
  );
};
