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
