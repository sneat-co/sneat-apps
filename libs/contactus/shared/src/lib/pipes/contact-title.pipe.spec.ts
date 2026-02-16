import { ContactTitlePipe, getContactTitle } from './contact-title.pipe';

describe('ContactTitlePipe', () => {
  let pipe: ContactTitlePipe;

  beforeEach(() => {
    pipe = new ContactTitlePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return title from brief', () => {
    expect(pipe.transform({ id: 'test', brief: { title: 'Test Title' } })).toBe(
      'Test Title',
    );
  });

  it('should return title from dbo when brief title is not available', () => {
    expect(pipe.transform({ id: 'test', dbo: { title: 'DBO Title' } })).toBe(
      'DBO Title',
    );
  });

  it('should prefer brief title over dbo title', () => {
    expect(
      pipe.transform({
        id: 'test',
        brief: { title: 'Brief Title' },
        dbo: { title: 'DBO Title' },
      }),
    ).toBe('Brief Title');
  });

  it('should use personNames when no title is available', () => {
    expect(
      pipe.transform({
        id: 'test',
        brief: { names: { firstName: 'John', lastName: 'Doe' } },
      }),
    ).toBe('John Doe');
  });

  it('should use id when no other information is available', () => {
    expect(pipe.transform({ id: 'test123' })).toBe('test123');
  });

  it('should return "MEMBER is UNDEFINED" when id is not available', () => {
    expect(pipe.transform({ id: '' })).toBe('MEMBER is UNDEFINED');
  });

  it('should prefer shortTitle parameter over all other values', () => {
    expect(
      pipe.transform({ id: 'test', brief: { title: 'Brief Title' } }, 'Short'),
    ).toBe('Short');
  });
});

describe('getContactTitle', () => {
  it('should return shortTitle when provided', () => {
    const result = getContactTitle(
      { id: 'test', brief: { title: 'Title' } },
      'Short',
    );
    expect(result).toBe('Short');
  });

  it('should return brief title when available', () => {
    const result = getContactTitle({
      id: 'test',
      brief: { title: 'Brief Title' },
    });
    expect(result).toBe('Brief Title');
  });

  it('should return dbo title when brief title not available', () => {
    const result = getContactTitle({ id: 'test', dbo: { title: 'DBO Title' } });
    expect(result).toBe('DBO Title');
  });

  it('should return person names when no title available', () => {
    const result = getContactTitle({
      id: 'test',
      brief: { names: { firstName: 'Jane', lastName: 'Smith' } },
    });
    expect(result).toBe('Jane Smith');
  });

  it('should return id when no other info available', () => {
    const result = getContactTitle({ id: 'unique-id' });
    expect(result).toBe('unique-id');
  });

  it('should return "MEMBER is UNDEFINED" for empty/missing id', () => {
    const result = getContactTitle({ id: '' });
    expect(result).toBe('MEMBER is UNDEFINED');
  });

  it('should handle undefined brief and dbo', () => {
    const result = getContactTitle({ id: 'test', brief: undefined });
    expect(result).toBe('test');
  });

  it('should handle null brief and dbo', () => {
    const result = getContactTitle({ id: 'test', brief: null });
    expect(result).toBe('test');
  });
});
