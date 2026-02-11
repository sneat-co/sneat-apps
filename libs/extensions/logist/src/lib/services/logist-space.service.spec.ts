import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { of } from 'rxjs';
import { LogistSpaceService } from './logist-space.service';

vi.mock('@angular/fire/firestore');

describe('LogistSpaceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogistSpaceService,
        {
          provide: SneatApiService,
          useValue: {
            post: vi.fn(() => of({})),
            get: vi.fn(() => of({})),
          },
        },
        {
          provide: Firestore,
          useValue: { type: 'Firestore', toJSON: () => ({}) },
        },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(LogistSpaceService)).toBeTruthy();
  });
});
