import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SneatUserService } from '@sneat/auth-core';
import { IUserSpaceBrief } from '@sneat/auth-models';
import { BehaviorSubject, Subject, of } from 'rxjs';

import { UserSpaceBriefProvider } from './user-space-brief.provider';

describe('UserSpaceBriefProvider', () => {
  it('should create', () => {
    const destroyed$ = new Subject<void>();
    const $spaceID = signal('test-space');
    const mockUserService = {
      userState: of({ record: { spaces: {} } }),
      userChanged: of(undefined),
    } as unknown as SneatUserService;

    const provider = new UserSpaceBriefProvider(
      destroyed$.asObservable(),
      $spaceID,
      mockUserService,
    );

    expect(provider).toBeTruthy();
    destroyed$.next();
    destroyed$.complete();
  });

  it('should return undefined when spaceID is empty', () => {
    const destroyed$ = new Subject<void>();
    const $spaceID = signal('');
    const mockUserService = {
      userState: of({ record: { spaces: {} } }),
      userChanged: of(undefined),
    } as unknown as SneatUserService;

    const provider = new UserSpaceBriefProvider(
      destroyed$.asObservable(),
      $spaceID,
      mockUserService,
    );

    expect(provider.$userSpaceBrief()).toBeUndefined();
    destroyed$.next();
    destroyed$.complete();
  });

  it('should return undefined when userSpaceBriefs is undefined', () => {
    const destroyed$ = new Subject<void>();
    const $spaceID = signal('test-space');
    const mockUserService = {
      userState: of({ record: undefined }),
      userChanged: of(undefined),
    } as unknown as SneatUserService;

    const provider = new UserSpaceBriefProvider(
      destroyed$.asObservable(),
      $spaceID,
      mockUserService,
    );

    expect(provider.$userSpaceBrief()).toBeUndefined();
    destroyed$.next();
    destroyed$.complete();
  });

  it('should return null when space is not found in userSpaceBriefs', () => {
    const destroyed$ = new Subject<void>();
    const $spaceID = signal('non-existent-space');
    const userStateSubject = new BehaviorSubject({
      record: { spaces: { 'other-space': {} } },
    });
    const mockUserService = {
      userState: userStateSubject.asObservable(),
      userChanged: of(undefined),
    } as unknown as SneatUserService;

    const provider = new UserSpaceBriefProvider(
      destroyed$.asObservable(),
      $spaceID,
      mockUserService,
    );

    // Wait for subscription to complete
    setTimeout(() => {
      expect(provider.$userSpaceBrief()).toBeNull();
    }, 0);

    destroyed$.next();
    destroyed$.complete();
  });

  it('should return userSpaceBrief when space exists', () => {
    const destroyed$ = new Subject<void>();
    const $spaceID = signal('test-space');
    const testSpaceBrief: IUserSpaceBrief = {
      title: 'Test Space',
      userContactID: 'contact-123',
    };
    const userStateSubject = new BehaviorSubject({
      record: { spaces: { 'test-space': testSpaceBrief } },
    });
    const mockUserService = {
      userState: userStateSubject.asObservable(),
      userChanged: of(undefined),
    } as unknown as SneatUserService;

    const provider = new UserSpaceBriefProvider(
      destroyed$.asObservable(),
      $spaceID,
      mockUserService,
    );

    // Wait for subscription to complete
    setTimeout(() => {
      expect(provider.$userSpaceBrief()).toEqual(testSpaceBrief);
    }, 0);

    destroyed$.next();
    destroyed$.complete();
  });

  it('should return undefined for userContactID when userSpaceBrief is undefined', () => {
    const destroyed$ = new Subject<void>();
    const $spaceID = signal('test-space');
    const mockUserService = {
      userState: of({ record: undefined }),
      userChanged: of(undefined),
    } as unknown as SneatUserService;

    const provider = new UserSpaceBriefProvider(
      destroyed$.asObservable(),
      $spaceID,
      mockUserService,
    );

    expect(provider.$userContactID()).toBeUndefined();
    destroyed$.next();
    destroyed$.complete();
  });

  it('should return null for userContactID when userSpaceBrief has no userContactID', () => {
    const destroyed$ = new Subject<void>();
    const $spaceID = signal('test-space');
    const testSpaceBrief: IUserSpaceBrief = {
      title: 'Test Space',
    };
    const userStateSubject = new BehaviorSubject({
      record: { spaces: { 'test-space': testSpaceBrief } },
    });
    const mockUserService = {
      userState: userStateSubject.asObservable(),
      userChanged: of(undefined),
    } as unknown as SneatUserService;

    const provider = new UserSpaceBriefProvider(
      destroyed$.asObservable(),
      $spaceID,
      mockUserService,
    );

    // Wait for subscription to complete
    setTimeout(() => {
      expect(provider.$userContactID()).toBeNull();
    }, 0);

    destroyed$.next();
    destroyed$.complete();
  });

  it('should return userContactID when it exists', () => {
    const destroyed$ = new Subject<void>();
    const $spaceID = signal('test-space');
    const testSpaceBrief: IUserSpaceBrief = {
      title: 'Test Space',
      userContactID: 'contact-123',
    };
    const userStateSubject = new BehaviorSubject({
      record: { spaces: { 'test-space': testSpaceBrief } },
    });
    const mockUserService = {
      userState: userStateSubject.asObservable(),
      userChanged: of(undefined),
    } as unknown as SneatUserService;

    const provider = new UserSpaceBriefProvider(
      destroyed$.asObservable(),
      $spaceID,
      mockUserService,
    );

    // Wait for subscription to complete
    setTimeout(() => {
      expect(provider.$userContactID()).toBe('contact-123');
    }, 0);

    destroyed$.next();
    destroyed$.complete();
  });
});
