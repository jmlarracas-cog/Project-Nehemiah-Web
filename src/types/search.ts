export type SearchResultCategory =
  | 'page'
  | 'sermon'
  | 'event'
  | 'ministry'
  | 'church'
  | 'faq'
  | 'visitor';

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  category: SearchResultCategory;
  categoryLabel: string;
  path: string;
  badge?: string;
  date?: string;
  speaker?: string;
  location?: string;
  scripture?: string;
  tags?: string[];
  relevanceScore?: number;
  snippet?: string;
}

export interface SearchFilterOptions {
  category?: SearchResultCategory | 'all';
}

export interface SearchGroupedResults {
  query: string;
  totalCount: number;
  results: SearchResultItem[];
  byCategory: Record<SearchResultCategory, SearchResultItem[]>;
}
