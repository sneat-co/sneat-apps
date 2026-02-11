import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';
import { HappeningService } from './happening.service';

vi.mock('@angular/fire/firestore');

describe('HappeningService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HappeningService,
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: Firestore,
          useValue: { type: 'Firestore', toJSON: () => ({}) },
        },
        {
          provide: SneatApiService,
          useValue: {
            post: vi.fn(() => of({})),
            get: vi.fn(() => of({})),
            delete: vi.fn(() => of(undefined)),
          },
        },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(HappeningService)).toBeTruthy();
  });
});
