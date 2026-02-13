import { TestBed } from '@angular/core/testing';
import { HappeningService } from './happening.service';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger } from '@sneat/core';
import { Firestore } from '@angular/fire/firestore';
import { Injector } from '@angular/core';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as spaceServices from '@sneat/space-services';

vi.mock('@sneat/space-services', () => ({
  ModuleSpaceItemService: vi.fn().mockImplementation(() => ({
    watchSpaceItemByIdWithSpaceRef: vi.fn(),
    watchModuleSpaceItemsWithSpaceRef: vi.fn(),
  })),
}));

vi.mock('@angular/fire/firestore', () => ({
  Firestore: vi.fn(),
  orderBy: vi.fn(),
}));

describe('HappeningService', () => {
  let service: HappeningService;
  let sneatApiServiceMock: { post: any; delete: any };
  let errorLoggerMock: any;

  beforeEach(() => {
    sneatApiServiceMock = {
      post: vi.fn(),
      delete: vi.fn(),
    };
    errorLoggerMock = {
      logErrorHandler: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        HappeningService,
        { provide: SneatApiService, useValue: sneatApiServiceMock },
        { provide: ErrorLogger, useValue: errorLoggerMock },
        { provide: Firestore, useValue: {} },
        { provide: Injector, useValue: { get: vi.fn() } },
      ],
    });
    service = TestBed.inject(HappeningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
// ... rest of the tests

  describe('statusFilter', () => {
    it('should return == operator for single status', () => {
      const filter = HappeningService.statusFilter(['active']);
      expect(filter).toEqual({ field: 'status', operator: '==', value: 'active' });
    });

    it('should return in operator for multiple statuses', () => {
      const filter = HappeningService.statusFilter(['active', 'canceled' as any]);
      expect(filter).toEqual({ field: 'status', operator: 'in', value: ['active', 'canceled'] });
    });
  });

  describe('createHappening', () => {
    it('should trim title and call api', () => {
      const request: any = {
        happening: {
          title: '  Test Title  ',
          type: 'single',
        },
      };
      sneatApiServiceMock.post.mockReturnValue(of({}));

      service.createHappening(request).subscribe();

      expect(sneatApiServiceMock.post).toHaveBeenCalledWith(
        'happenings/create_happening',
        expect.objectContaining({
          happening: expect.objectContaining({
            title: 'Test Title',
          }),
        })
      );
    });

    it('should throw error if single happening has recurring slots', async () => {
      const request: any = {
        happening: {
          title: 'Test',
          type: 'single',
          slots: {
            s1: { repeats: 'weekly' },
          },
        },
      };

      try {
        await new Promise((resolve, reject) => {
          service.createHappening(request).subscribe({
            next: resolve,
            error: reject,
          });
        });
        throw new Error('Should have thrown');
      } catch (err) {
        expect(err).toBe('Single occurrence happening cannot have recurring slots');
      }
    });
  });

  describe('deleteHappening', () => {
    it('should call delete api', () => {
      const happening: any = {
        id: 'h1',
        space: { id: 's1' },
      };
      sneatApiServiceMock.delete.mockReturnValue(of({}));

      service.deleteHappening(happening).subscribe();

      expect(sneatApiServiceMock.delete).toHaveBeenCalledWith(
        'happenings/delete_happening',
        undefined,
        expect.objectContaining({
          spaceID: 's1',
          happeningID: 'h1',
        })
      );
    });
  });
});
