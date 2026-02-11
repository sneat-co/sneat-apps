import { ContactTitlePipe } from './contact-title.pipe';

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
});
