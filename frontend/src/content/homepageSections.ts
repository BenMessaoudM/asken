export type HomepageSectionSource = 'static' | 'news-api' | 'events-api' | 'future-cms'

export interface HomepageSectionDefinition {
  id: string
  source: HomepageSectionSource
}

// These stable section identifiers keep the public composition independent from
// copy and data sources so each section can later be replaced by CMS content.
export const homepageSections = {
  hero: { id: 'home-hero', source: 'static' },
  latestNews: { id: 'latest-news', source: 'news-api' },
  upcomingEvents: { id: 'upcoming-events', source: 'events-api' },
  cor: { id: 'cor', source: 'future-cms' },
  collaborations: { id: 'collaborations', source: 'future-cms' },
  membership: { id: 'membership', source: 'static' },
  contact: { id: 'contact', source: 'static' }
} satisfies Record<string, HomepageSectionDefinition>
