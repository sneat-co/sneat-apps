import { LookupPipe } from './lookup-pipe';

describe('LookupPipe', () => {
  it('should create', () => {
    expect(new LookupPipe({}, 'path', 'src', 'tgt')).toBeTruthy();
  });
});
