import { WdToWeekdayPipe, wdCodeToWeekdayLongName } from './wd-to-weekday.pipe';

describe('WdToWeekdayPipe', () => {
  it('should create', () => {
    expect(new WdToWeekdayPipe()).toBeTruthy();
  });

  it('should transform weekday codes to long names', () => {
    const pipe = new WdToWeekdayPipe();
    expect(pipe.transform('mo')).toBe('Monday');
    expect(pipe.transform('tu')).toBe('Tuesday');
    expect(pipe.transform('we')).toBe('Wednesday');
    expect(pipe.transform('th')).toBe('Thursday');
    expect(pipe.transform('fr')).toBe('Friday');
    expect(pipe.transform('sa')).toBe('Saturday');
    expect(pipe.transform('su')).toBe('Sunday');
  });

  it('should handle undefined input', () => {
    const pipe = new WdToWeekdayPipe();
    expect(pipe.transform(undefined)).toBe('undefined');
  });
});

describe('wdCodeToWeekdayLongName', () => {
  it('should return long name for valid weekday code', () => {
    expect(wdCodeToWeekdayLongName('mo')).toBe('Monday');
  });

  it('should return string representation for undefined', () => {
    expect(wdCodeToWeekdayLongName(undefined)).toBe('undefined');
  });
});
