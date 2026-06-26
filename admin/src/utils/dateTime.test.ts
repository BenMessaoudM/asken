import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTimePickerValue, formatTime, parseDateTimePickerValue, validateDateTimeRange } from './dateTime';

describe('dateTime picker helpers', () => {
  it('formats dates as DD.MM.YYYY and time as HH:mm', () => {
    const value = '2026-07-18T13:00:00.000Z';
    expect(formatDate(value)).toBe('18.07.2026');
    expect(formatTime(value)).toBe('16:00');
  });

  it('formats admin booking detail start and end picker values', () => {
    expect(formatDateTimePickerValue('2026-07-18T13:00:00.000Z')).toEqual({ date: '18.07.2026', time: '16:00' });
    expect(formatDateTimePickerValue('2026-07-18T19:00:00.000Z')).toEqual({ date: '18.07.2026', time: '22:00' });
  });

  it('formats public booking form start and end picker values', () => {
    expect(formatDateTimePickerValue('2026-06-27T07:00:00.000Z')).toEqual({ date: '27.06.2026', time: '10:00' });
    expect(formatDateTimePickerValue('2026-08-20T15:00:00.000Z')).toEqual({ date: '20.08.2026', time: '18:00' });
  });

  it('parses picker values to ISO safely', () => {
    const parsed = parseDateTimePickerValue({ date: '18.07.2026', time: '16:00' });
    expect(parsed?.toISOString()).toBe('2026-07-18T13:00:00.000Z');
    expect(parseDateTimePickerValue({ date: '18.07.2026', time: '4:00' })).toBeNull();
    expect(parseDateTimePickerValue({ date: '07/18/2026', time: '16:00' })).toBeNull();
  });

  it('validates required, invalid, and end-before-start ranges', () => {
    expect(validateDateTimeRange({ date: '', time: '10:00' }, { date: '27.06.2026', time: '11:00' })).toBe('required');
    expect(validateDateTimeRange({ date: '27.06.2026', time: '10:00' }, { date: '27.06.2026', time: 'bad' })).toBe('invalid');
    expect(validateDateTimeRange({ date: '27.06.2026', time: '10:00' }, { date: '27.06.2026', time: '09:59' })).toBe('order');
    expect(validateDateTimeRange({ date: '27.06.2026', time: '10:00' }, { date: '27.06.2026', time: '10:01' })).toBeNull();
  });
});
