import { PersonTitle } from './person-title.pipe';

describe('PersonTitle', () => {
  let pipe: PersonTitle;

  beforeEach(() => {
    pipe = new PersonTitle();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return NO TITLE for undefined', () => {
    expect(pipe.transform(undefined)).toBe('NO TITLE');
  });

  it('should return title from dbo', () => {
    expect(pipe.transform({ id: 'test', dbo: { title: 'Test Person' } })).toBe(
      'Test Person',
    );
  });
});
