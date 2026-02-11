import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { ContactusSpaceService } from './contactus-space.service';

vi.mock('@angular/fire/firestore', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    collection: vi.fn().mockReturnValue({}),
  };
});

describe('ContactusSpaceService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        ContactusSpaceService,
        {
          provide: Firestore,
          useValue: { type: 'Firestore', toJSON: () => ({}) },
        },
      ],
    }),
  );

  it('should be created', () => {
    expect(TestBed.inject(ContactusSpaceService)).toBeTruthy();
  });
});
