import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { AnalyticsService } from '@sneat/core';

import { NavService } from './nav.service';

describe('NavServiceService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        NavService,
        {
          provide: NavController,
          useValue: { navigateRoot: vi.fn(), navigateForward: vi.fn() },
        },
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: vi.fn(() => vi.fn()),
          },
        },
        { provide: AnalyticsService, useValue: { logEvent: vi.fn() } },
      ],
    }),
  );

  it('should be created', () => {
    const service: NavService = TestBed.inject(NavService);
    expect(service).toBeTruthy();
  });
});
