import { PublicLanguage } from '../localization/languages';

export type ThemeLocale = Extract<PublicLanguage, 'sv' | 'en'>;
export type WebsiteThemeType = 'seasonal' | 'campaign' | 'recruitment' | 'event' | 'custom';
export type WebsiteThemeStatus = 'draft' | 'active' | 'inactive' | 'archived';
export type DecorationType = 'none' | 'ducks' | 'snow' | 'confetti' | 'pride' | 'candles' | 'flowers' | 'pumpkins' | 'sparkles' | 'ribbons' | 'custom';
export type ThemeTargetPage = 'home' | 'membership' | 'events' | 'booking' | 'organization' | 'governance' | 'recruitment' | 'all';
export type ThemeCampaignType = 'gulis' | 'tutor_recruitment' | 'board_recruitment' | 'student_council_election' | 'crew_recruitment' | 'staff_recruitment' | 'custom';

export interface LocalizedText { sv: string; en: string; }
export interface WebsiteTheme {
  id: string; key: string; name: LocalizedText; description?: LocalizedText; type: WebsiteThemeType; status: WebsiteThemeStatus;
  enabled: boolean; automaticActivation: boolean; manualOverride: boolean; priority: number; recurringYearly: boolean;
  startDate?: Date; endDate?: Date; startMonthDay?: string; endMonthDay?: string; timezone: string;
  decorationType: DecorationType; accentColor?: string; secondaryAccentColor?: string; bannerImageUrl?: string; mascotImageUrl?: string; decorativeAssetUrl?: string; backgroundPatternUrl?: string; logoVariantUrl?: string; chatbotMascotAssetUrl?: string; animationEnabled: boolean; respectReducedMotion: boolean;
  announcementTitle: LocalizedText; announcementText: LocalizedText; heroTitle: LocalizedText; heroText: LocalizedText; ctaPrimaryLabel?: LocalizedText; ctaPrimaryUrl?: string; ctaSecondaryLabel?: LocalizedText; ctaSecondaryUrl?: string; homepageCardTitle?: LocalizedText; homepageCardText?: LocalizedText; homepageCardUrl?: string;
  showOnHomepage: boolean; showAnnouncementBar: boolean; showHeroDecoration: boolean; showNavigationBadge: boolean; highlightedNavItems: string[]; targetPages: ThemeTargetPage[];
  campaignType?: ThemeCampaignType; externalCtaUrl?: string; relatedRecruitmentCampaignId?: string;
  createdBy?: string; updatedBy?: string; createdAt: Date; updatedAt: Date;
}
export interface PublicWebsiteTheme { id: string; key: string; name: string; type: WebsiteThemeType; decorationType: DecorationType; accentColor?: string; secondaryAccentColor?: string; bannerImageUrl?: string; mascotImageUrl?: string; decorativeAssetUrl?: string; backgroundPatternUrl?: string; logoVariantUrl?: string; chatbotMascotAssetUrl?: string; animationEnabled: boolean; respectReducedMotion: boolean; announcementTitle: string; announcementText: string; heroTitle: string; heroText: string; ctaPrimaryLabel?: string; ctaPrimaryUrl?: string; ctaSecondaryLabel?: string; ctaSecondaryUrl?: string; homepageCardTitle?: string; homepageCardText?: string; homepageCardUrl?: string; showOnHomepage: boolean; showAnnouncementBar: boolean; showHeroDecoration: boolean; showNavigationBadge: boolean; highlightedNavItems: string[]; targetPages: ThemeTargetPage[]; campaignType?: ThemeCampaignType; activeReason: string; }
export interface ActiveThemeResolution { theme: WebsiteTheme | null; reason: string; overlappingThemes: WebsiteTheme[]; nextThemes: WebsiteTheme[]; }
export interface ThemeService { listAdmin(): Promise<WebsiteTheme[]>; create(input: Omit<WebsiteTheme, 'id' | 'createdAt' | 'updatedAt'>): Promise<WebsiteTheme>; update(id: string, input: Omit<WebsiteTheme, 'id' | 'createdAt' | 'updatedAt'>): Promise<WebsiteTheme>; archive(id: string): Promise<void>; activeResolution(now?: Date): Promise<ActiveThemeResolution>; getPublicActive(locale: ThemeLocale, now?: Date): Promise<PublicWebsiteTheme | null>; preview(id: string, locale: ThemeLocale): Promise<PublicWebsiteTheme>; }
