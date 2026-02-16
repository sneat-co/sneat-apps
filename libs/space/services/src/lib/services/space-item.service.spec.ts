import { TestBed } from '@angular/core/testing';
import { Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { firstValueFrom, of } from 'rxjs';
import {
  GlobalSpaceItemService,
  ModuleSpaceItemService,
} from './space-item.service';

// Mock collection function
vi.mock('@angular/fire/firestore', async () => {
  const actual = await vi.importActual('@angular/fire/firestore');
  return {
    ...actual,
    collection: vi.fn(() => ({ id: 'mock-collection' })),
  };
});

describe('GlobalSpaceItemService', () => {
  let service: GlobalSpaceItemService<any, any>;
  let mockInjector: Injector;
  let mockFirestore: Firestore;
  let mockSneatApiService: SneatApiService;

  beforeEach(() => {
    mockInjector = TestBed.inject(Injector);
    mockFirestore = {
      type: 'Firestore',
      toJSON: () => ({}),
    } as unknown as Firestore;
    mockSneatApiService = {
      post: vi.fn(),
      delete: vi.fn(),
    } as unknown as SneatApiService;

    service = new GlobalSpaceItemService(
      mockInjector,
      'test-collection',
      mockFirestore,
      mockSneatApiService,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw error if collectionName is not provided', () => {
    expect(() => {
      new GlobalSpaceItemService(
        mockInjector,
        '',
        mockFirestore,
        mockSneatApiService,
      );
    }).toThrow('collectionName is required');
  });

  it('should have correct collection name', () => {
    expect(service.collectionName).toBe('test-collection');
  });

  it('should delete space item', async () => {
    const mockResponse = { success: true };
    vi.spyOn(mockSneatApiService, 'delete').mockReturnValue(of(mockResponse));

    const request = { spaceID: 'space1' };
    const response = await firstValueFrom(
      service.deleteSpaceItem('test-endpoint', request),
    );
    expect(response).toEqual(mockResponse);
    expect(mockSneatApiService.delete).toHaveBeenCalledWith(
      'test-endpoint',
      undefined,
      request,
    );
  });

  it('should create space item', async () => {
    const mockResponse = {
      id: 'item1',
      dbo: { name: 'Test Item' },
    };
    vi.spyOn(mockSneatApiService, 'post').mockReturnValue(of(mockResponse));

    const spaceRef = { id: 'space1', type: 'team' as const };
    const request = { spaceID: 'space1', data: { name: 'Test' } };

    const item = await firstValueFrom(
      service.createSpaceItem('create-endpoint', spaceRef, request),
    );
    expect(item.id).toBe('item1');
    expect(item.space).toEqual(spaceRef);
    expect(item.dbo).toEqual(mockResponse.dbo);
  });

  it('should throw error if create response is empty', async () => {
    vi.spyOn(mockSneatApiService, 'post').mockReturnValue(of(null as any));

    const spaceRef = { id: 'space1', type: 'team' as const };
    const request = { spaceID: 'space1' };

    await expect(
      firstValueFrom(
        service.createSpaceItem('create-endpoint', spaceRef, request),
      ),
    ).rejects.toThrow('create team item response is empty');
  });

  it('should throw error if create response has no ID', async () => {
    const mockResponse = { dbo: { name: 'Test' } };
    vi.spyOn(mockSneatApiService, 'post').mockReturnValue(of(mockResponse));

    const spaceRef = { id: 'space1', type: 'team' as const };
    const request = { spaceID: 'space1' };

    await expect(
      firstValueFrom(
        service.createSpaceItem('create-endpoint', spaceRef, request),
      ),
    ).rejects.toThrow('create team item response have no ID');
  });
});

describe('ModuleSpaceItemService', () => {
  let service: ModuleSpaceItemService<any, any>;
  let mockInjector: Injector;
  let mockFirestore: Firestore;
  let mockSneatApiService: SneatApiService;

  beforeEach(() => {
    mockInjector = TestBed.inject(Injector);
    mockFirestore = {
      type: 'Firestore',
      toJSON: () => ({}),
    } as unknown as Firestore;
    mockSneatApiService = {
      post: vi.fn(),
    } as unknown as SneatApiService;

    vi.mocked(collection).mockReturnValue({ id: 'spaces' } as any);

    service = new ModuleSpaceItemService(
      mockInjector,
      'test-module',
      'items',
      mockFirestore,
      mockSneatApiService,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw error if moduleID is not provided', () => {
    expect(() => {
      new ModuleSpaceItemService(
        mockInjector,
        '',
        'items',
        mockFirestore,
        mockSneatApiService,
      );
    }).toThrow('moduleID is required');
  });

  it('should have correct moduleID', () => {
    expect(service.moduleID).toBe('test-module');
  });

  it('should throw error when creating collection ref without spaceID', () => {
    expect(() => {
      // Access protected method via any cast for testing
      (service as any).collectionRef('');
    }).toThrow('spaceID is required');
  });
});
