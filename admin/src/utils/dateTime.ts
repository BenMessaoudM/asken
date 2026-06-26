const formatterOptions = { timeZone: 'Europe/Helsinki' };

function toDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parts(value?: string | Date | null) {
  const date = toDate(value);
  if (!date) return null;
  const dateParts = new Intl.DateTimeFormat('fi-FI', {
    ...formatterOptions,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const part = (type: string) => dateParts.find((item) => item.type === type)?.value || '';
  return {
    day: part('day'),
    month: part('month'),
    year: part('year'),
    hour: part('hour'),
    minute: part('minute'),
  };
}

export function formatDate(value?: string | Date | null) {
  const item = parts(value);
  return item ? `${item.day}.${item.month}.${item.year}` : '';
}

export function formatTime(value?: string | Date | null) {
  const item = parts(value);
  return item ? `${item.hour}:${item.minute}` : '';
}

export function formatDateTime(value?: string | Date | null) {
  const date = formatDate(value);
  const time = formatTime(value);
  return date && time ? `${date} ${time}` : date || time;
}

export function parseDate(value: string): Date | null {
  const match = value.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0);
  if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) return null;
  return date;
}

export function parseDateTime(value: string): Date | null {
  const match = value.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})$/);
  if (!match) return null;
  const [, day, month, year, hour, minute] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), 0, 0);
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day) ||
    date.getHours() !== Number(hour) ||
    date.getMinutes() !== Number(minute)
  ) return null;
  return date;
}

export interface DateTimePickerValue { date: string; time: string; }
export type DateTimeRangeValidation = 'required' | 'invalid' | 'order' | null;

export function formatDateTimePickerValue(value?: string | Date | null): DateTimePickerValue {
  return { date: formatDate(value), time: formatTime(value) };
}

export function parseDateTimePickerValue(value: DateTimePickerValue): Date | null {
  if (!value.date.trim() || !value.time.trim()) return null;
  if (!/^\d{2}:\d{2}$/.test(value.time.trim())) return null;
  return parseDateTime(value.date.trim() + ' ' + value.time.trim());
}

export function validateDateTimeRange(start: DateTimePickerValue, end: DateTimePickerValue): DateTimeRangeValidation {
  if (!start.date.trim() || !start.time.trim() || !end.date.trim() || !end.time.trim()) return 'required';
  const startAt = parseDateTimePickerValue(start);
  const endAt = parseDateTimePickerValue(end);
  if (!startAt || !endAt) return 'invalid';
  return endAt > startAt ? null : 'order';
}

export function formatTimeRange(start?: string | Date | null, end?: string | Date | null) {
  const startTime = formatTime(start);
  const endTime = formatTime(end);
  if (!startTime || !endTime) return startTime || endTime;
  return `${startTime}–${endTime}`;
}

export function formatDateRange(start?: string | Date | null, end?: string | Date | null) {
  const startDate = formatDate(start);
  const endDate = formatDate(end);
  const times = formatTimeRange(start, end);
  if (!startDate || !endDate) return startDate || endDate;
  if (startDate === endDate) return times ? `${startDate} ${times}` : startDate;
  return `${formatDateTime(start)}–${formatDateTime(end)}`;
}
