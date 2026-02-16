import { TestBed } from '@angular/core/testing';
import { Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection } from '@angular/fire/firestore';
import { SpaceModuleService } from './space-module.service';

// Mock collection function
vi.mock('@angular/fire/firestore', async () => {
  const actual = await vi.importActual('@angular/fire/firestore');
  return {
    ...actual,
    collection: vi.fn(() => ({ id: 'mock-collection' })),
  };
});

class TestSpaceModuleService extends SpaceModuleService<{ title: string }> {
  constructor(injector: Injector, afs: Firestore) {
    super(injector, 'test-module', afs);
  }
}

describe('SpaceModuleService', () => {
  let service: TestSpaceModuleService;
  let mockFirestore: Firestore;

  beforeEach(() => {
    mockFirestore = {
      type: 'Firestore',
      toJSON: () => ({}),
    } as unknown as Firestore;

    vi.mocked(collection).mockReturnValue({ id: 'spaces' } as any);

    const injector = TestBed.inject(Injector);
    service = new TestSpaceModuleService(injector, mockFirestore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct moduleID', () => {
    expect(service.moduleID).toBe('test-module');
  });

  it('should have correct collectionName', () => {
    expect(service.collectionName).toBe('ext');
  });
});
