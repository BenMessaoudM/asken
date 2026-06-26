import { formatDate, formatDateRange, formatDateTime, formatTime, formatTimeRange } from './dateTime';

describe('dateTime formatting', () => {
  const start = '2026-08-20T15:00:00.000Z';
  const end = '2026-08-20T20:00:00.000Z';

  it('formats dates as DD.MM.YYYY', () => {
    expect(formatDate(start)).toBe('20.08.2026');
  });

  it('formats times in 24-hour Helsinki time', () => {
    expect(formatTime(start)).toBe('18:00');
  });

  it('formats date-times with date and 24-hour time', () => {
    expect(formatDateTime('2026-09-02T11:30:00.000Z')).toBe('02.09.2026 14:30');
  });

  it('formats same-day ranges compactly', () => {
    expect(formatDateRange(start, end)).toBe('20.08.2026 18:00–23:00');
    expect(formatTimeRange(start, end)).toBe('18:00–23:00');
  });

  it('handles missing and invalid values safely', () => {
    expect(formatDate(undefined)).toBe('');
    expect(formatTime('not-a-date')).toBe('');
  });
});
