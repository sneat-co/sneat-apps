import { SpaceType } from '@sneat/core';
import { SpaceEmojiPipe } from './team-emoji.pipe';

describe('SpaceEmojiPipe', () => {
  it('should create', () => {
    expect(new SpaceEmojiPipe()).toBeTruthy();
  });

  const testCases: { type: SpaceType | 'unknown'; emoji: string | undefined }[] =
    [
      { type: 'family', emoji: '👨‍👩‍👧‍👦' },
      { type: 'cohabit', emoji: '🤝' },
      { type: 'sport_club', emoji: '⚽' },
      { type: 'educator', emoji: '💃' },
      { type: 'realtor', emoji: '🏘️' },
      { type: 'parish', emoji: '⛪' },
      { type: 'private', emoji: '🕶️' },
      { type: 'unknown', emoji: undefined },
    ];

  testCases.forEach(({ type, emoji }) => {
    it(`should return ${emoji} for type ${type}`, () => {
      const pipe = new SpaceEmojiPipe();
      expect(pipe.transform(type as SpaceType)).toBe(emoji);
    });
  });
});
