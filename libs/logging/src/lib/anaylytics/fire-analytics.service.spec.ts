import { TestBed } from '@angular/core/testing';
import { Analytics } from '@angular/fire/analytics';
import { ErrorLogger } from '@sneat/core';
import { FireAnalyticsService } from './fire-analytics.service';

describe('FireAnalyticsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FireAnalyticsService,
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: Analytics,
          useValue: {},
        },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(FireAnalyticsService)).toBeTruthy();
  });
});
