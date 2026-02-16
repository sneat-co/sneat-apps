import { TestBed } from '@angular/core/testing';
import {
  Router,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Auth } from '@angular/fire/auth';
import {
  SneatAuthGuard,
  redirectToLoginIfNotSignedIn,
} from './sneat-auth-guard';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, firstValueFrom } from 'rxjs';

describe('SneatAuthGuard', () => {
  let guard: SneatAuthGuard;
  let routerMock: {
    createUrlTree: ReturnType<typeof vi.fn>;
    parseUrl: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    routerMock = {
      createUrlTree: vi.fn(),
      parseUrl: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        SneatAuthGuard,
        { provide: Router, useValue: routerMock },
        {
          provide: Auth,
          useValue: {},
        },
      ],
    });

    guard = TestBed.inject(SneatAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canLoad', () => {
    it('should return true', () => {
      const route: Route = { path: 'test' };
      const segments: UrlSegment[] = [];

      const result = guard.canLoad(route, segments);
      expect(result).toBe(true);
    });
  });

  describe('canActivate', () => {
    it('should return true', () => {
      const route = {} as ActivatedRouteSnapshot;
      const state = { url: '/test' } as RouterStateSnapshot;

      const result = guard.canActivate(route, state);
      expect(result).toBe(true);
    });
  });

  describe('canActivateChild', () => {
    it('should return true', () => {
      const childRoute = {} as ActivatedRouteSnapshot;
      const state = { url: '/test/child' } as RouterStateSnapshot;

      const result = guard.canActivateChild(childRoute, state);
      expect(result).toBe(true);
    });
  });
});

describe('redirectToLoginIfNotSignedIn', () => {
  it('should return true for authenticated user', async () => {
    const user = { uid: 'test-uid' };

    const result = await firstValueFrom(
      of(user).pipe(redirectToLoginIfNotSignedIn),
    );
    expect(result).toBe(true);
  });

  it('should return login URL for unauthenticated user at root', async () => {
    const originalPathname = location.pathname;
    Object.defineProperty(window.location, 'pathname', {
      writable: true,
      value: '/',
    });

    const result = await firstValueFrom(
      of(null).pipe(redirectToLoginIfNotSignedIn),
    );
    expect(result).toBe('/login');

    Object.defineProperty(window.location, 'pathname', {
      writable: true,
      value: originalPathname,
    });
  });

  it('should return login URL with hash for unauthenticated user at non-root path', async () => {
    const originalPathname = location.pathname;
    Object.defineProperty(window.location, 'pathname', {
      writable: true,
      value: '/protected',
    });

    const result = await firstValueFrom(
      of(null).pipe(redirectToLoginIfNotSignedIn),
    );
    expect(result).toBe('/login#/protected');

    Object.defineProperty(window.location, 'pathname', {
      writable: true,
      value: originalPathname,
    });
  });
});
