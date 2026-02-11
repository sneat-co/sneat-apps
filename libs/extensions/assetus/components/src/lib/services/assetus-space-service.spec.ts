import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { AssetusSpaceService } from './assetus-space.service';

vi.mock('@angular/fire/firestore', () => ({
  collection: vi.fn(),
  Firestore: vi.fn(),
}));

describe('AssetusSpaceService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        AssetusSpaceService,
        {
          provide: Firestore,
          useValue: {},
        },
      ],
    }),
  );

  it('should be created', () => {
    expect(TestBed.inject(AssetusSpaceService)).toBeTruthy();
  });
});
