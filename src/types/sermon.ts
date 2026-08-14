import { ContentStatus, ContentMeta } from './about';

export type VideoProvider = 'youtube' | 'vimeo' | 'direct' | 'none';

export interface SermonScripture {
  reference: string;
  text?: string;
  passage?: string;
}

export interface SermonSpeaker {
  id: string;
  name: string;
  title: string;
  role?: string;
  avatarUrl?: string;
}

export interface SermonSeries {
  id: string;
  slug: string;
  title: string;
  description: string;
  bannerUrl?: string;
  status?: ContentStatus;
}

export interface Sermon {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  speaker: string | SermonSpeaker;
  speakerId?: string;
  speakerRole?: string;
  series: string | SermonSeries;
  seriesId?: string;
  scripture: SermonScripture;
  scriptureReference?: string;
  date: string;
  duration: string;
  thumbnailUrl: string;
  thumbnailAlt?: string;
  videoUrl?: string;
  videoProvider?: VideoProvider;
  audioUrl?: string;
  notesUrl?: string;
  notesContent?: {
    outline: string[];
    keyTakeaways: string[];
    reflectionQuestions: string[];
  };
  tags?: string[];
  category?: string;
  featured?: boolean;
  displayOrder?: number;
  status?: ContentStatus;
  meta?: ContentMeta;
}

export interface SermonFilterOptions {
  category?: string;
  seriesId?: string;
  speakerId?: string;
  searchQuery?: string;
  featuredOnly?: boolean;
}

export interface SermonsPageData {
  hero: {
    title: string;
    goldSubtitle?: string;
    subtitle: string;
    bgImage: string;
    imageAlt: string;
    scriptureQuote?: {
      text: string;
      reference: string;
    };
    status?: ContentStatus;
  };
  categories: string[];
  seriesList: SermonSeries[];
  speakersList: SermonSpeaker[];
  sermons: Sermon[];
  seo: {
    title: string;
    description: string;
    socialImage?: string;
  };
}
