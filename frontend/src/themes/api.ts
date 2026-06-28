import i18n from '../i18n'
import { getJson } from '../api/client'
import { PublicWebsiteTheme } from './types'
const locale = () => i18n.language?.startsWith('en') ? 'en' : 'sv'
export function activeTheme() { return getJson<{ data: { theme: PublicWebsiteTheme | null } }>(`/themes/active?lang=${locale()}`) }
