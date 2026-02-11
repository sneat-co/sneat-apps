import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { ContactGroupService } from './contact-group-service';

vi.mock('@angular/fire/firestore', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    collection: vi.fn().mockReturnValue({}),
  };
});

describe('ContactGroupService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        ContactGroupService,
        {
          provide: Firestore,
          useValue: { type: 'Firestore', toJSON: () => ({}) },
        },
        {
          provide: SneatApiService,
          useValue: {
            post: vi.fn(),
            get: vi.fn(),
            delete: vi.fn(),
          },
        },
      ],
    }),
  );

  it('should be created', () => {
    expect(TestBed.inject(ContactGroupService)).toBeTruthy();
  });
});
