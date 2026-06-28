import { ActiveThemeResolution, WebsiteTheme } from '../types';

function helsinkiMonthDay(now: Date, timeZone = 'Europe/Helsinki') {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone, month: '2-digit', day: '2-digit' }).formatToParts(now);
  const month = parts.find((part) => part.type === 'month')?.value || '01';
  const day = parts.find((part) => part.type === 'day')?.value || '01';
  return `${month}-${day}`;
}
function monthDayNumber(value?: string) { return value && /^\d{2}-\d{2}$/.test(value) ? Number(value.replace('-', '')) : undefined; }
export function isThemeActive(theme: WebsiteTheme, now = new Date()) {
  if (!theme.enabled || theme.status !== 'active') return false;
  if (theme.manualOverride) return true;
  if (!theme.automaticActivation) return false;
  if (theme.recurringYearly) {
    const start = monthDayNumber(theme.startMonthDay), end = monthDayNumber(theme.endMonthDay), today = monthDayNumber(helsinkiMonthDay(now, theme.timezone));
    if (!start || !end || !today) return false;
    return start <= end ? today >= start && today <= end : today >= start || today <= end;
  }
  if (!theme.startDate || !theme.endDate) return false;
  return now.getTime() >= new Date(theme.startDate).getTime() && now.getTime() <= new Date(theme.endDate).getTime();
}
export function resolveActiveTheme(themes: WebsiteTheme[], now = new Date()): ActiveThemeResolution {
  const candidates = themes.filter((theme) => isThemeActive(theme, now)).sort((a, b) => b.priority - a.priority || new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const nextThemes = themes.filter((theme) => theme.enabled && theme.status === 'active' && theme.automaticActivation && !isThemeActive(theme, now)).sort((a, b) => (a.startDate?.getTime() || 0) - (b.startDate?.getTime() || 0)).slice(0, 5);
  const theme = candidates[0] || null;
  const reason = !theme ? 'no_active_theme' : theme.manualOverride ? 'manual_override' : theme.recurringYearly ? 'recurring_schedule' : 'scheduled_date';
  return { theme, reason, overlappingThemes: candidates.slice(1), nextThemes };
}
