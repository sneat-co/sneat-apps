import { IListDbo } from '@sneat/extension-listus-contract';

import {
  getWatchlistTmdbIDs,
  withAddedID,
  withRemovedID,
} from './discover-movies.utils';

describe('getWatchlistTmdbIDs', () => {
  it('returns an empty set for a missing dbo', () => {
    expect(getWatchlistTmdbIDs(undefined).size).toBe(0);
    expect(getWatchlistTmdbIDs(null).size).toBe(0);
  });

  it('returns an empty set for a list without items', () => {
    expect(getWatchlistTmdbIDs({ title: 'To Watch' } as IListDbo).size).toBe(0);
  });

  it('collects tmdbIDs and skips items without one', () => {
    const dbo = {
      title: 'To Watch',
      items: [
        { id: 'i1', title: 'Inception', tmdbID: 27205 },
        { id: 'i2', title: 'Free-text item without tmdbID' },
        { id: 'i3', title: 'The Matrix', tmdbID: 603 },
      ],
    } as IListDbo;
    const ids = getWatchlistTmdbIDs(dbo);
    expect(ids.size).toBe(2);
    expect(ids.has(27205)).toBe(true);
    expect(ids.has(603)).toBe(true);
  });
});

describe('withAddedID / withRemovedID', () => {
  it('adds without mutating the original', () => {
    const original: ReadonlySet<number> = new Set([1]);
    const next = withAddedID(original, 2);
    expect(next.has(1)).toBe(true);
    expect(next.has(2)).toBe(true);
    expect(original.has(2)).toBe(false);
    expect(next).not.toBe(original);
  });

  it('removes without mutating the original', () => {
    const original: ReadonlySet<number> = new Set([1, 2]);
    const next = withRemovedID(original, 2);
    expect(next.has(2)).toBe(false);
    expect(original.has(2)).toBe(true);
    expect(next).not.toBe(original);
  });
});
