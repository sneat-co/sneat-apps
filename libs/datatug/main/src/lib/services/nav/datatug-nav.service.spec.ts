import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { DatatugNavService } from './datatug-nav.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('DatatugNavService', () => {
  let service: DatatugNavService;
  let navMock: any;
  let errorLoggerMock: any;

  beforeEach(() => {
    navMock = {
      navigateRoot: vi.fn().mockResolvedValue(true),
      navigateForward: vi.fn().mockResolvedValue(true),
    };
    errorLoggerMock = {
      logError: vi.fn(),
      logErrorHandler: vi.fn().mockReturnValue(() => {}),
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
      const store: any = {
        ref: { type: 'firestore' },
      };
      service.goStore(store);
      expect(navMock.navigateRoot).toHaveBeenCalledWith(
        ['store', 'firestore'],
        undefined
      );
    });

    it('should throw error if ref is missing', () => {
      expect(() => service.goStore({} as any)).toThrow('store.ref is a required parameter');
    });
  });

  describe('projectPageUrl', () => {
    it('should return correct project page url', () => {
      const ref: any = { storeId: 's1', projectId: 'p1' };
      const url = service.projectPageUrl(ref, 'overview');
      expect(url).toBe('/store/s1/project/p1/overview');
    });

    it('should include encoded id if provided', () => {
      const ref: any = { storeId: 's1', projectId: 'p1' };
      const url = service.projectPageUrl(ref, 'env', 'prod/env');
      expect(url).toBe('/store/s1/project/p1/env/prod%2Fenv');
    });
  });
});
