import { IListDbo } from '@sneat/extension-listus-contract';

// Extracts the TMDB ids of movies already on a watch list, so Discover
// candidates that are already bookmarked can be marked as such. Items without
// a tmdbID (e.g. manually added free-text items) are simply skipped.
export function getWatchlistTmdbIDs(
  dbo?: IListDbo | null,
): ReadonlySet<number> {
  const ids = new Set<number>();
  dbo?.items?.forEach((item) => {
    if (item.tmdbID) {
      ids.add(item.tmdbID);
    }
  });
  return ids;
}

// Adds a single id to a readonly set without mutating the original —
// signal-friendly (set a new reference so computed()s re-evaluate).
export function withAddedID(
  ids: ReadonlySet<number>,
  id: number,
): ReadonlySet<number> {
  const next = new Set(ids);
  next.add(id);
  return next;
}

// Removes a single id from a readonly set without mutating the original.
export function withRemovedID(
  ids: ReadonlySet<number>,
  id: number,
): ReadonlySet<number> {
  const next = new Set(ids);
  next.delete(id);
  return next;
}
