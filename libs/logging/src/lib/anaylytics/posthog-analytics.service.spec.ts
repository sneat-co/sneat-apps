import { TestBed } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { PosthogAnalyticsService } from './posthog-analytics.service';

describe('PosthogAnalyticsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PosthogAnalyticsService,
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(PosthogAnalyticsService)).toBeTruthy();
  });
});
