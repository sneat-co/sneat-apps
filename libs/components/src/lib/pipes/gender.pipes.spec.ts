import { Gender } from '@sneat/core';
import {
  GenderIconNamePipe,
  GenderEmojiPipe,
  GenderColorPipe,
} from './gender.pipes';

describe('GenderIconNamePipe', () => {
  let pipe: GenderIconNamePipe;

  beforeEach(() => {
    pipe = new GenderIconNamePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  const cases: { gender: Gender | undefined; expected: string }[] = [
    { gender: 'male', expected: 'man-outline' },
    { gender: 'female', expected: 'woman-outline' },
    { gender: 'other', expected: 'person-circle-outline' },
    { gender: 'unknown', expected: 'person-outline' },
    { gender: 'undisclosed', expected: 'person' },
    { gender: undefined, expected: 'person-outline' },
  ];

  cases.forEach(({ gender, expected }) => {
    it(`should return ${expected} for gender ${gender}`, () => {
      expect(pipe.transform(gender)).toBe(expected);
    });
  });
});

describe('GenderEmojiPipe', () => {
  let pipe: GenderEmojiPipe;

  beforeEach(() => {
    pipe = new GenderEmojiPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  const cases: { gender: Gender | undefined; expected: string }[] = [
    { gender: 'male', expected: 'man-outline' },
    { gender: 'female', expected: 'woman-outline' },
    { gender: undefined, expected: 'person-outline' },
  ];

  cases.forEach(({ gender, expected }) => {
    it(`should return ${expected} for gender ${gender}`, () => {
      expect(pipe.transform(gender)).toBe(expected);
    });
  });
});

describe('GenderColorPipe', () => {
  let pipe: GenderColorPipe;

  beforeEach(() => {
    pipe = new GenderColorPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  const cases: { gender: Gender | undefined; expected: string }[] = [
    { gender: 'male', expected: 'primary' },
    { gender: 'female', expected: 'danger' },
    { gender: 'other', expected: 'warning' },
    { gender: 'unknown', expected: 'medium' },
    { gender: 'undisclosed', expected: 'medium' },
    { gender: undefined, expected: 'dark' },
  ];

  cases.forEach(({ gender, expected }) => {
    it(`should return ${expected} for gender ${gender}`, () => {
      expect(pipe.transform(gender)).toBe(expected);
    });
  });
});
