import {
  SearchResultItem,
  SearchResultCategory,
  SearchGroupedResults,
} from '../types/search';
import { sermonData } from '../data/sermonData';
import { eventData } from '../data/eventData';
import { ministriesPageData } from '../data/ministryData';
import { churchLocationsData } from '../data/churchData';
import { visitPageData } from '../data/visitData';
import { prayerData } from '../data/prayerData';

// Public pages catalog
const staticPages: SearchResultItem[] = [
  {
    id: 'page-home',
    title: 'Home Page',
    description: 'Welcome to Church of God – Subic. Discover worship services, ministries, and community fellowship.',
    category: 'page',
    categoryLabel: 'Page',
    path: '/',
    badge: 'Main',
  },
  {
    id: 'page-about',
    title: 'About Us',
    description: 'Our history, mission, vision, statement of faith, core beliefs, and pastoral leadership team.',
    category: 'page',
    categoryLabel: 'Page',
    path: '/about',
    tags: ['about', 'history', 'beliefs', 'leadership', 'pastors', 'mission', 'vision'],
  },
  {
    id: 'page-ministries',
    title: 'Church Ministries',
    description: 'Explore Worship, Youth, Kingdom Kids, Community Outreach, Life Groups, and Family Ministries.',
    category: 'page',
    categoryLabel: 'Page',
    path: '/ministries',
    tags: ['ministries', 'youth', 'kids', 'worship', 'outreach', 'couples'],
  },
  {
    id: 'page-sermons',
    title: 'Sermons & Teachings',
    description: 'Watch, listen, and reflect on Sunday messages, sermon series, and biblical teachings.',
    category: 'page',
    categoryLabel: 'Page',
    path: '/sermons',
    tags: ['sermons', 'preaching', 'bible', 'teachings', 'video', 'series'],
  },
  {
    id: 'page-events',
    title: 'Events & Church Calendar',
    description: 'Stay updated on upcoming worship rallies, youth conferences, retreats, and community service missions.',
    category: 'page',
    categoryLabel: 'Page',
    path: '/events',
    tags: ['events', 'calendar', 'worship night', 'conference', 'retreat'],
  },
  {
    id: 'page-prayer',
    title: 'Prayer Ministry',
    description: 'Submit prayer requests, join intercession teams, and explore biblical prayer guides.',
    category: 'page',
    categoryLabel: 'Page',
    path: '/prayer',
    tags: ['prayer', 'intercession', 'healing', 'request', 'faith'],
  },
  {
    id: 'page-churches',
    title: 'Church Locations',
    description: 'Locate Church of God primary and candidate worship-location information.',
    category: 'page',
    categoryLabel: 'Page',
    path: '/churches',
    tags: ['locations', 'subic', 'olongapo', 'zambales'],
  },
  {
    id: 'page-visit',
    title: 'Plan Your Visit',
    description: 'First-time visitor guide, Sunday worship schedule, guest parking info, and host greeting pre-registration.',
    category: 'page',
    categoryLabel: 'Page',
    path: '/visit',
    tags: ['visit', 'guests', 'parking', 'schedule', 'expectations', 'faq'],
  },
  {
    id: 'page-contact',
    title: 'Contact Us',
    description: 'Connect with Church of God – Subic through official channels or submit a inquiry form.',
    category: 'page',
    categoryLabel: 'Page',
    path: '/contact',
    tags: ['contact', 'email', 'phone', 'address', 'hours', 'office'],
  },
];

/**
 * Builds the index of search items across public church domain entities
 */
export function buildSearchIndex(): SearchResultItem[] {
  const index: SearchResultItem[] = [...staticPages];

  // 1. Index Sermons
  sermonData.sermons.forEach((sermon) => {
    if (sermon.status === 'archived' || sermon.status === 'draft') return;
    const speakerName =
      typeof sermon.speaker === 'string'
        ? sermon.speaker
        : sermon.speaker.name;
    const seriesTitle =
      typeof sermon.series === 'string'
        ? sermon.series
        : sermon.series.title;

    index.push({
      id: `sermon-${sermon.id}`,
      title: sermon.title,
      description: sermon.description,
      category: 'sermon',
      categoryLabel: 'Sermon',
      path: `/sermons/${sermon.slug}`,
      badge: sermon.category,
      date: sermon.date,
      speaker: speakerName,
      scripture: sermon.scripture?.reference || sermon.scriptureReference,
      tags: sermon.tags,
      snippet: `Series: ${seriesTitle} • Speaker: ${speakerName} • Scripture: ${sermon.scripture?.reference || sermon.scriptureReference || 'N/A'}`,
    });
  });

  // 2. Index Events
  eventData.events.forEach((evt) => {
    if (evt.status === 'archived' || evt.status === 'draft') return;
    index.push({
      id: `event-${evt.id}`,
      title: evt.title,
      description: evt.description || evt.shortDescription || '',
      category: 'event',
      categoryLabel: 'Event',
      path: `/events/${evt.slug}`,
      badge: evt.category,
      date: evt.startDate,
      location: evt.location?.name ? `${evt.location.name}, ${evt.location.city || 'Subic'}` : 'Church Sanctuary',
      tags: evt.tags,
      snippet: `Date: ${evt.startDate || evt.date} • Location: ${evt.location?.name || 'Subic Campus'} • Category: ${evt.category}`,
    });
  });

  // 3. Index Ministries
  ministriesPageData.ministries.forEach((min) => {
    if (min.status === 'archived' || min.status === 'draft') return;
    index.push({
      id: `ministry-${min.id}`,
      title: min.name,
      description: min.description || min.shortDescription || min.tagline || '',
      category: 'ministry',
      categoryLabel: 'Ministry',
      path: `/ministries/${min.slug}`,
      badge: min.category,
      speaker: min.leader?.name,
      tags: min.highlights || [],
      snippet: `${min.tagline || ''} • Leader: ${min.leader?.name || 'Ministry Team'} • Meeting: ${min.meetingSchedule?.time || min.meetingTime || 'Weekly'}`,
    });
  });

  // 4. Index Church Locations
  churchLocationsData.forEach((church) => {
    const serviceSummary = church.services
      .map((s) => `${s.name} (${s.day})`)
      .join(', ');

    index.push({
      id: `church-${church.id}`,
      title: church.name,
      description: church.shortDescription || church.description[0],
      category: 'church',
      categoryLabel: 'Location',
      path: `/churches/${church.slug}`,
      badge: church.churchType,
      location: `${church.city}, ${church.province}`,
      snippet: `${church.churchType} in ${church.city}, ${church.province}. ${serviceSummary ? `Services: ${serviceSummary}` : ''}`,
    });
  });

  // 5. Index Visitor FAQs & Guide Blocks
  visitPageData.guideItems.forEach((guide) => {
    index.push({
      id: `guide-${guide.id}`,
      title: guide.question,
      description: guide.answer,
      category: 'visitor',
      categoryLabel: 'Visitor Guide',
      path: '/visit',
      badge: 'FAQ',
      snippet: `First-Time Visitor FAQ (${guide.category}): ${guide.answer}`,
    });
  });

  visitPageData.expectationBlocks.forEach((block) => {
    index.push({
      id: `expect-${block.id}`,
      title: block.title,
      description: block.description,
      category: 'visitor',
      categoryLabel: 'What To Expect',
      path: '/visit',
      snippet: `Sunday Worship Experience: ${block.description}`,
    });
  });

  // 6. Index Prayer FAQs
  prayerData.faqs.forEach((faq, idx) => {
    index.push({
      id: `prayer-faq-${idx}`,
      title: faq.question,
      description: faq.answer,
      category: 'faq',
      categoryLabel: 'Prayer Guide',
      path: '/prayer',
      badge: 'Prayer FAQ',
      snippet: `Prayer Ministry Guide: ${faq.answer}`,
    });
  });

  return index;
}

/**
 * Perform search over indexed site content
 */
export function searchSiteContent(
  query: string,
  categoryFilter: SearchResultCategory | 'all' = 'all'
): SearchGroupedResults {
  const trimmed = query.trim().toLowerCase();
  const allIndex = buildSearchIndex();

  const emptyCategories: Record<SearchResultCategory, SearchResultItem[]> = {
    page: [],
    sermon: [],
    event: [],
    ministry: [],
    church: [],
    faq: [],
    visitor: [],
  };

  if (!trimmed) {
    return {
      query: '',
      totalCount: 0,
      results: [],
      byCategory: emptyCategories,
    };
  }

  const terms = trimmed.split(/\s+/).filter((t) => t.length > 0);

  const scoredResults: SearchResultItem[] = [];

  allIndex.forEach((item) => {
    // Check category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return;
    }

    const titleLower = item.title.toLowerCase();
    const descLower = item.description.toLowerCase();
    const tagsLower = (item.tags || []).join(' ').toLowerCase();
    const speakerLower = (item.speaker || '').toLowerCase();
    const locationLower = (item.location || '').toLowerCase();
    const scriptureLower = (item.scripture || '').toLowerCase();
    const snippetLower = (item.snippet || '').toLowerCase();

    let score = 0;

    // Check query terms
    for (const term of terms) {
      if (titleLower.includes(term)) {
        score += titleLower === term ? 100 : 40;
      }
      if (speakerLower.includes(term)) score += 25;
      if (scriptureLower.includes(term)) score += 25;
      if (tagsLower.includes(term)) score += 20;
      if (locationLower.includes(term)) score += 15;
      if (descLower.includes(term)) score += 10;
      if (snippetLower.includes(term)) score += 5;
    }

    if (score > 0) {
      scoredResults.push({
        ...item,
        relevanceScore: score,
      });
    }
  });

  // Sort by score descending
  scoredResults.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

  // Group by category
  const byCategory: Record<SearchResultCategory, SearchResultItem[]> = {
    page: [],
    sermon: [],
    event: [],
    ministry: [],
    church: [],
    faq: [],
    visitor: [],
  };

  scoredResults.forEach((item) => {
    if (byCategory[item.category]) {
      byCategory[item.category].push(item);
    }
  });

  return {
    query,
    totalCount: scoredResults.length,
    results: scoredResults,
    byCategory,
  };
}
