import { TestBed } from '@angular/core/testing';
import { CalendarNavService } from './calendar-nav.service';
import { ErrorLogger } from '@sneat/core';
import { SpaceNavService } from '@sneat/space-services';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { ISlotUIEvent } from '@sneat/mod-schedulus-core';

describe('CalendarNavService', () => {
  let service: CalendarNavService;
  let spaceNavServiceMock: Partial<Record<keyof SpaceNavService, Mock>>;
  let errorLoggerMock: Partial<Record<keyof ErrorLogger, Mock>>;

  beforeEach(() => {
    spaceNavServiceMock = {
      navigateForwardToSpacePage: vi.fn().mockResolvedValue(true),
    };
    errorLoggerMock = {
      logErrorHandler: vi.fn().mockReturnValue(() => {
        /* noop */
      }),
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
    const args = {
      slot: {
        happening: {
          id: 'h1',
          space: { id: 's1' },
          title: 'Test Happening',
        },
      },
    } as unknown as ISlotUIEvent;

    service.navigateToHappeningPage(args);

    expect(spaceNavServiceMock.navigateForwardToSpacePage).toHaveBeenCalledWith(
      (args.slot.happening as unknown as { space: unknown }).space,
      'happening/h1',
      {
        state: { happening: args.slot.happening },
      },
    );
  });

  it('should log error when navigation fails', async () => {
    const error = new Error('Navigation failed');
    spaceNavServiceMock.navigateForwardToSpacePage?.mockRejectedValue(error);
    const errorHandler = vi.fn();
    errorLoggerMock.logErrorHandler?.mockReturnValue(errorHandler);

    const args = {
      slot: {
        happening: {
          id: 'h1',
          space: { id: 's1' },
        },
      },
    } as unknown as ISlotUIEvent;

    service.navigateToHappeningPage(args);

    // Wait for the promise to reject
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(errorLoggerMock.logErrorHandler).toHaveBeenCalledWith(
      'failed to navigate to recurring happening page',
    );
    expect(errorHandler).toHaveBeenCalled();
  });
});
