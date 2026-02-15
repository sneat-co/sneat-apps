import { LongMonthNamePipe } from './long-month-name.pipe';

describe('LongMonthNamePipe', () => {
  let pipe: LongMonthNamePipe;

  beforeEach(() => {
    pipe = new LongMonthNamePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  const cases = [
    { month: 0, expected: 'January' },
    { month: 1, expected: 'February' },
    { month: 2, expected: 'March' },
    { month: 3, expected: 'April' },
    { month: 4, expected: 'May' },
    { month: 5, expected: 'June' },
    { month: 6, expected: 'July' },
    { month: 7, expected: 'August' },
    { month: 8, expected: 'September' },
    { month: 9, expected: 'October' },
    { month: 10, expected: 'November' },
    { month: 11, expected: 'December' },
    { month: 12, expected: '12' },
    { month: undefined, expected: 'undefined' },
  ];

  cases.forEach(({ month, expected }) => {
    it(`should return ${expected} for month ${month}`, () => {
      expect(pipe.transform(month)).toBe(expected);
    });
  });
});
