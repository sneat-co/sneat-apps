import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';
import { CalendarDayService } from './calendar-day.service';

vi.mock('@angular/fire/firestore');

describe('CalendarDayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CalendarDayService,
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
          useValue: { post: vi.fn(() => of({})), get: vi.fn(() => of({})) },
        },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(CalendarDayService)).toBeTruthy();
  });
});
