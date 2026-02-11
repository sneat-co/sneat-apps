import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { AssetService } from './asset-service';

vi.mock('@angular/fire/firestore', () => ({
  collection: vi.fn(),
  Firestore: vi.fn(),
}));

describe('AssetService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        AssetService,
        {
          provide: Firestore,
          useValue: {},
        },
        {
          provide: SneatApiService,
          useValue: { post: vi.fn(), delete: vi.fn() },
        },
      ],
    }),
  );

  it('should be created', () => {
    expect(TestBed.inject(AssetService)).toBeTruthy();
  });
});
