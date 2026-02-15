import { TestBed } from '@angular/core/testing';
import { HappeningService, ICreateHappeningRequest } from './happening.service';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger } from '@sneat/core';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { HappeningStatus, IHappeningContext } from '@sneat/mod-schedulus-core';

vi.mock('@sneat/space-services', () => ({
  ModuleSpaceItemService: class {
    watchSpaceItemByIdWithSpaceRef = vi.fn();
    watchModuleSpaceItemsWithSpaceRef = vi.fn();
  },
}));

vi.mock('@angular/fire/firestore', () => ({
  Firestore: vi.fn(),
  orderBy: vi.fn(),
}));

describe('HappeningService', () => {
  let service: HappeningService;
  let sneatApiServiceMock: { post: Mock; delete: Mock };
  let errorLoggerMock: { logErrorHandler: Mock };

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
      ],
    });
    service = TestBed.inject(HappeningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('statusFilter', () => {
    it('should return == operator for single status', () => {
      const filter = HappeningService.statusFilter(['active']);
      expect(filter).toEqual({
        field: 'status',
        operator: '==',
        value: 'active',
      });
    });

    it('should return in operator for multiple statuses', () => {
      const filter = HappeningService.statusFilter([
        'active',
        'canceled' as HappeningStatus,
      ]);
      expect(filter).toEqual({
        field: 'status',
        operator: 'in',
        value: ['active', 'canceled'],
      });
    });
  });

  describe('createHappening', () => {
    it('should trim title and call api', () => {
      const request = {
        happening: {
          title: '  Test Title  ',
          type: 'single',
          slots: {
            s1: {
              repeats: 'once',
              start: { time: '10:00' },
            },
          },
        },
      } as unknown as ICreateHappeningRequest;
      sneatApiServiceMock.post.mockReturnValue(of({}));

      service.createHappening(request).subscribe();

      expect(sneatApiServiceMock.post).toHaveBeenCalledWith(
        'happenings/create_happening',
        expect.objectContaining({
          happening: expect.objectContaining({
            title: 'Test Title',
          }),
        }),
      );
    });

    it('should throw error if single happening has recurring slots', async () => {
      const request = {
        happening: {
          title: 'Test',
          type: 'single',
          slots: {
            s1: { repeats: 'weekly' },
          },
        },
      } as unknown as ICreateHappeningRequest;

      try {
        await new Promise((resolve, reject) => {
          service.createHappening(request).subscribe({
            next: resolve,
            error: reject,
          });
        });
        throw new Error('Should have thrown');
      } catch (err) {
        expect(err).toBe(
          'Single occurrence happening cannot have recurring slots',
        );
      }
    });
  });

  describe('deleteHappening', () => {
    it('should call delete api', () => {
      const happening = {
        id: 'h1',
        space: { id: 's1' },
      } as unknown as IHappeningContext;
      sneatApiServiceMock.delete.mockReturnValue(of({}));

      service.deleteHappening(happening).subscribe();

      expect(sneatApiServiceMock.delete).toHaveBeenCalledWith(
        'happenings/delete_happening',
        undefined,
        expect.objectContaining({
          spaceID: 's1',
          happeningID: 'h1',
        }),
      );
    });
  });
});
