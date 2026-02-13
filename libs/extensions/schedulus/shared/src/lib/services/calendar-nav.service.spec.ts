import { TestBed } from '@angular/core/testing';
import { CalendarNavService } from './calendar-nav.service';
import { ErrorLogger } from '@sneat/core';
import { SpaceNavService } from '@sneat/space-services';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CalendarNavService', () => {
  let service: CalendarNavService;
  let spaceNavServiceMock: any;
  let errorLoggerMock: any;

  beforeEach(() => {
    spaceNavServiceMock = {
      navigateForwardToSpacePage: vi.fn().mockResolvedValue(true),
    };
    errorLoggerMock = {
      logErrorHandler: vi.fn().mockReturnValue(() => {}),
    };

    TestBed.configureTestingModule({
      providers: [
        CalendarNavService,
        { provide: SpaceNavService, useValue: spaceNavServiceMock },
        { provide: ErrorLogger, useValue: errorLoggerMock },
      ],
    });
    service = TestBed.inject(CalendarNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to happening page', () => {
    const args: any = {
      slot: {
        happening: {
          id: 'h1',
          space: 's1',
          title: 'Test Happening',
        },
      },
    };

    service.navigateToHappeningPage(args);

    expect(spaceNavServiceMock.navigateForwardToSpacePage).toHaveBeenCalledWith(
      's1',
      'happening/h1',
      {
        state: { happening: args.slot.happening },
      }
    );
  });

  it('should log error when navigation fails', async () => {
    const error = new Error('Navigation failed');
    spaceNavServiceMock.navigateForwardToSpacePage.mockRejectedValue(error);
    const errorHandler = vi.fn();
    errorLoggerMock.logErrorHandler.mockReturnValue(errorHandler);

    const args: any = {
      slot: {
        happening: {
          id: 'h1',
          space: 's1',
        },
      },
    };

    service.navigateToHappeningPage(args);

    // Wait for the promise to reject
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(errorLoggerMock.logErrorHandler).toHaveBeenCalledWith(
      'failed to navigate to recurring happening page'
    );
    expect(errorHandler).toHaveBeenCalled();
  });
});
