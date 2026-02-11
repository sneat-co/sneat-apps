import { TestBed } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { SpaceNavService } from '@sneat/space-services';
import { ScheduleNavService } from './schedule-nav.service';

describe('ScheduleNavService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScheduleNavService,
        {
          provide: SpaceNavService,
          useValue: {
            navigateForwardToSpacePage: vi.fn(() => Promise.resolve(true)),
          },
        },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(ScheduleNavService)).toBeTruthy();
  });
});
