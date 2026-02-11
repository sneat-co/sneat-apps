import { Provider } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ClassName } from '@sneat/ui';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import {
  APP_INFO,
  LOGGER_FACTORY,
  NgModulePreloaderService,
  AnalyticsService,
} from '@sneat/core';
import { ErrorLogger } from '@sneat/core';
import { SneatUserService } from '@sneat/auth-core';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { ScheduleNavService } from '@sneat/mod-schedulus-core';
import {
  HappeningService,
  CalendariumSpaceService,
  HappeningComponentBaseParams,
} from '@sneat/extensions-schedulus-shared';

export const mockSneatUserService = {
  user$: of({}),
  currentUserId: 'test-user',
};

export const mockSpaceService = {
  watchSpaceModuleRecord: vi.fn(() => of({})),
  watchSpaceItemByIdWithSpaceRef: vi.fn(() => of({})),
};

export const mockScheduleNavService = {
  goNewHappening: vi.fn(),
  navigateToHappening: vi.fn(),
};

export const mockHappeningService = {
  watchHappeningByID: vi.fn(() => of({})),
};

export const mockCalendariumSpaceService = {
  watchSpaceModuleRecord: vi.fn(() => of({})),
};

export function provideSchedulusMocks(): Provider[] {
  return [
    { provide: ClassName, useValue: 'TestComponent' },
    { provide: SneatUserService, useValue: mockSneatUserService },
    { provide: SpaceService, useValue: mockSpaceService },
    { provide: ScheduleNavService, useValue: mockScheduleNavService },
    { provide: HappeningService, useValue: mockHappeningService },
    { provide: CalendariumSpaceService, useValue: mockCalendariumSpaceService },
    {
      provide: ActivatedRoute,
      useValue: {
        paramMap: of({ get: () => null }),
        queryParamMap: of({ get: () => null }),
        snapshot: {
          paramMap: { get: () => null },
          queryParamMap: { get: () => null },
        },
        params: of({}),
      },
    },
    {
      provide: APP_INFO,
      useValue: { appId: 'schedulus', appTitle: 'Schedulus' },
    },
    { provide: LOGGER_FACTORY, useValue: { getLogger: () => console } },
    {
      provide: ErrorLogger,
      useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
    },
    { provide: AnalyticsService, useValue: { logEvent: vi.fn() } },
    {
      provide: SpaceNavService,
      useValue: { navigateForwardToSpacePage: vi.fn() },
    },
    { provide: NgModulePreloaderService, useValue: { preload: vi.fn() } },
    SpaceComponentBaseParams,
    HappeningComponentBaseParams,
  ];
}
