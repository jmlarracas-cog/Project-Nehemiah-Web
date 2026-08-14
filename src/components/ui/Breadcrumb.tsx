import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`py-4 ${className}`}>
      <ol className="flex items-center flex-wrap space-x-2 text-xs sm:text-sm font-medium">
        <li>
          <a
            href="/"
            className="flex items-center text-slate-500 hover:text-gold transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            <span>Home</span>
          </a>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRight className="w-4 h-4 text-slate-400" />
              {isLast || !item.path ? (
                <span className="text-gold font-bold uppercase tracking-wider" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.path}
                  className="text-slate-500 hover:text-gold transition-colors capitalize"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
