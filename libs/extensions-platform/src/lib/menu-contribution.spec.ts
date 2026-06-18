import { describe, it, expect } from 'vitest';
import {
  isWellFormedMenuItem,
  menuItemUrl,
  sanitizeMenuItems,
} from './menu-contribution';

const ORIGIN = 'https://listus.app';

describe('isWellFormedMenuItem', () => {
  it('accepts an item with non-empty title and path', () => {
    expect(isWellFormedMenuItem({ title: 'Lists', path: '/lists' })).toBe(true);
    expect(
      isWellFormedMenuItem({
        title: 'Lists',
        emoji: '📋',
        path: '/lists',
        args: { id: 1 },
      }),
    ).toBe(true);
  });

  it('rejects items with an empty or missing title or path', () => {
    expect(isWellFormedMenuItem({ title: '', path: '/x' })).toBe(false);
    expect(isWellFormedMenuItem({ title: 'X', path: '' })).toBe(false);
    expect(isWellFormedMenuItem({ path: '/x' })).toBe(false);
    expect(isWellFormedMenuItem({ title: 'X' })).toBe(false);
    expect(isWellFormedMenuItem(null)).toBe(false);
    expect(isWellFormedMenuItem('nope')).toBe(false);
  });

  it('rejects items with wrong-typed emoji or args', () => {
    expect(isWellFormedMenuItem({ title: 'X', path: '/x', emoji: 1 })).toBe(
      false,
    );
    expect(isWellFormedMenuItem({ title: 'X', path: '/x', args: 'no' })).toBe(
      false,
    );
  });
});

describe('sanitizeMenuItems', () => {
  it('keeps well-formed items and drops malformed ones', () => {
    const items = [
      { title: 'Lists', path: '/lists' },
      { title: '', path: '/bad' },
      { title: 'No path' },
      { title: 'Tasks', emoji: '✅', path: '/tasks', args: { open: true } },
    ];
    const kept = sanitizeMenuItems(items);
    expect(kept.map((i) => i.title)).toEqual(['Lists', 'Tasks']);
  });
});

describe('menuItemUrl', () => {
  it('routes the single iframe to origin + path', () => {
    expect(menuItemUrl(ORIGIN, { title: 'Lists', path: '/lists' })).toBe(
      'https://listus.app/lists',
    );
  });

  it('serialises args as query parameters', () => {
    const url = menuItemUrl(ORIGIN, {
      title: 'Item',
      path: '/item',
      args: { id: 42, q: 'milk' },
    });
    expect(url).toContain('https://listus.app/item?');
    expect(url).toContain('id=42');
    expect(url).toContain('q=milk');
  });
});
