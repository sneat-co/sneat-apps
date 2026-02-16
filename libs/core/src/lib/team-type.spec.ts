import { describe, it, expect } from 'vitest';
import { SpaceTypeFamily } from './team-type';

describe('team-type', () => {
  it('should have correct value for SpaceTypeFamily', () => {
    expect(SpaceTypeFamily).toBe('family');
  });
});
