import { secondsToStr } from './date-time-pipes';

describe('secondsToStr', () => {
  it('should return undefined for undefined or null input', () => {
    expect(secondsToStr(undefined as any)).toBeUndefined();
    expect(secondsToStr(null as any)).toBeUndefined();
  });

  it('should format seconds to string correctly', () => {
    expect(secondsToStr(0)).toBe('');
    expect(secondsToStr(1)).toBe('1 second');
    expect(secondsToStr(60)).toBe('1 minute');
    expect(secondsToStr(61)).toBe('1 min 1 sec');
    expect(secondsToStr(3600)).toBe('1 hour');
    expect(secondsToStr(3661)).toBe('1 hour 1 min 1 sec');
    expect(secondsToStr(86400)).toBe('1 day');
    expect(secondsToStr(31536000)).toBe('1 year');
  });

  it('should handle plural forms', () => {
    expect(secondsToStr(2)).toBe('2 seconds');
    expect(secondsToStr(120)).toBe('2 minutes');
    expect(secondsToStr(122)).toBe('2 mins 2 secs');
  });
});
