import React from 'react';
import { MinistryCategory } from '../../types/ministry';

interface MinistryCategoryFilterProps {
  categories: MinistryCategory[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const MinistryCategoryFilter: React.FC<MinistryCategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-4 no-scrollbar">
      <div
        className="flex items-center space-x-2 min-w-max bg-slate-100 p-1.5 rounded-xl border border-slate-200"
        role="tablist"
        aria-label="Ministry categories filter"
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id || activeCategory === cat.name;

          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`category-panel-${cat.id}`}
              id={`category-tab-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-gold ${
                isActive
                  ? 'bg-navy text-gold shadow-md border border-gold/40'
                  : 'text-slate-700 hover:text-navy hover:bg-white/80'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
