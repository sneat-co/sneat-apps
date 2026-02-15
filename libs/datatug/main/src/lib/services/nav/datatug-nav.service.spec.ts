import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { DatatugNavService } from './datatug-nav.service';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { IDatatugStoreContext } from '../../nav/nav-models';
import { IProjectRef } from '../../core/project-context';

describe('DatatugNavService', () => {
  let service: DatatugNavService;
  let navMock: Partial<Record<keyof NavController, Mock>>;
  let errorLoggerMock: Partial<Record<keyof ErrorLogger, Mock>>;

  beforeEach(() => {
    navMock = {
      navigateRoot: vi.fn().mockResolvedValue(true),
      navigateForward: vi.fn().mockResolvedValue(true),
    };
    errorLoggerMock = {
      logError: vi.fn(),
      logErrorHandler: vi.fn().mockReturnValue(() => {
        /* noop */
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        DatatugNavService,
        { provide: NavController, useValue: navMock },
        { provide: ErrorLogger, useValue: errorLoggerMock },
      ],
    });
    service = TestBed.inject(DatatugNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('goStore', () => {
    it('should navigate to store page', () => {
      const store = {
        ref: { type: 'firestore' },
      } as unknown as IDatatugStoreContext;
      service.goStore(store);
      expect(navMock.navigateRoot).toHaveBeenCalledWith(
        ['store', 'firestore'],
        undefined,
      );
    });

    it('should throw error if ref is missing', () => {
      expect(() =>
        service.goStore({} as unknown as IDatatugStoreContext),
      ).toThrow('store.ref is a required parameter');
    });
  });

  describe('projectPageUrl', () => {
    const projectRef = { storeId: 's1', projectId: 'p1' } as IProjectRef;

    it('should return correct project page url', () => {
      const url = service.projectPageUrl(projectRef, 'overview');
      expect(url).toBe('/store/s1/project/p1/overview');
    });

    it('should include encoded id if provided', () => {
      const url = service.projectPageUrl(projectRef, 'env', 'prod/env');
      expect(url).toBe('/store/s1/project/p1/env/prod%2Fenv');
    });
  });
});
