import { ShortMonthNamePipe } from './short-month-name.pipe';

describe('ShortMonthNamePipe', () => {
  let pipe: ShortMonthNamePipe;

  beforeEach(() => {
    pipe = new ShortMonthNamePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  const cases = [
    { month: 0, expected: 'Jan' },
    { month: 5, expected: 'Jun' },
    { month: 11, expected: 'Dec' },
    { month: 12, expected: '12' },
    { month: -1, expected: '-1' },
    { month: undefined, expected: 'undefined' },
  ];

  cases.forEach(({ month, expected }) => {
    it(`should return ${expected} for month ${month}`, () => {
      expect(pipe.transform(month)).toBe(expected);
    });
  });
});
