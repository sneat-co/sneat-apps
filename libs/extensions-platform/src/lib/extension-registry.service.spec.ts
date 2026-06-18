import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ExtensionRegistry } from './extension-registry.service';
import { ExtensionRegistration } from './models';

function registration(
  over: Partial<ExtensionRegistration> = {},
): ExtensionRegistration {
  return {
    id: 'listus.app',
    origin: 'https://listus.app',
    url: 'https://listus.app',
    manifest: {
      name: 'Listus',
      author: { name: 'Jane', email: 'jane@listus.app' },
      icon: 'https://listus.app/icon.png',
      scopes: ['lists:read'],
      origin: 'https://listus.app',
    },
    scopes: ['lists:read'],
    ...over,
  };
}

describe('ExtensionRegistry', () => {
  let registry: ExtensionRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    registry = TestBed.inject(ExtensionRegistry);
  });

  it('creates and reads a registration keyed by id', () => {
    registry.create(registration());
    expect(registry.has('listus.app')).toBe(true);
    expect(registry.get('listus.app')?.origin).toBe('https://listus.app');
  });

  it('lists all registrations', () => {
    registry.create(registration());
    registry.create(
      registration({ id: 'other.app', origin: 'https://other.app' }),
    );
    expect(
      registry
        .list()
        .map((r) => r.id)
        .sort(),
    ).toEqual(['listus.app', 'other.app']);
  });

  it('deletes a registration', () => {
    registry.create(registration());
    expect(registry.delete('listus.app')).toBe(true);
    expect(registry.has('listus.app')).toBe(false);
    expect(registry.delete('listus.app')).toBe(false);
  });
});
