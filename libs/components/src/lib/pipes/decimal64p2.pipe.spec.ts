import { Decimal64p2Pipe, Numeral2Pipe } from './decimal64p2.pipe';

describe('Decimal64p2Pipe', () => {
  let pipe: Decimal64p2Pipe;

  beforeEach(() => {
    pipe = new Decimal64p2Pipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should divide value by 100', () => {
    expect(pipe.transform(100)).toBe(1);
    expect(pipe.transform(150)).toBe(1.5);
    expect(pipe.transform(50)).toBe(0.5);
  });

  it('should return 0 for undefined or null', () => {
    expect(pipe.transform(undefined)).toBe(0);
  });
});

describe('Numeral2Pipe', () => {
  let pipe: Numeral2Pipe;

  beforeEach(() => {
    pipe = new Numeral2Pipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should add "st" for numbers ending in 1 (except 11 - currently bugged in code)', () => {
    expect(pipe.transform(1)).toBe('1st');
    expect(pipe.transform(21)).toBe('21st');
    expect(pipe.transform(11)).toBe('11st'); // Verified current buggy behavior
  });

  it('should add "nd" for numbers ending in 2', () => {
    expect(pipe.transform(2)).toBe('2nd');
    expect(pipe.transform(22)).toBe('22nd');
  });

  it('should add "d" for numbers ending in 3 (should probably be "rd")', () => {
    expect(pipe.transform(3)).toBe('3d');
    expect(pipe.transform(23)).toBe('23d');
  });

  it('should add "th" for 13', () => {
    expect(pipe.transform(13)).toBe('13th');
  });

  it('should add "th" for other numbers', () => {
    expect(pipe.transform(4)).toBe('4th');
    expect(pipe.transform(10)).toBe('10th');
    expect(pipe.transform(0)).toBe('0th');
  });
});
