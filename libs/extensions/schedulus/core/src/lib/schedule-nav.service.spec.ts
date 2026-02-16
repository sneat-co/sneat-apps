import { TestBed } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceNavService } from '@sneat/space-services';
import { ScheduleNavService } from './schedule-nav.service';

describe('ScheduleNavService', () => {
  let service: ScheduleNavService;
  let spaceNavService: SpaceNavService;
  let errorLogger: ErrorLogger;
  let mockSpace: ISpaceContext;

  beforeEach(() => {
    const spaceNavServiceMock = {
      navigateForwardToSpacePage: vi.fn(() => Promise.resolve(true)),
    };

    const errorLoggerMock = {
      logError: vi.fn(),
      logErrorHandler: vi.fn(() => vi.fn()),
    };

    TestBed.configureTestingModule({
      providers: [
        ScheduleNavService,
        {
          provide: SpaceNavService,
          useValue: spaceNavServiceMock,
        },
        {
          provide: ErrorLogger,
          useValue: errorLoggerMock,
        },
      ],
    });

    service = TestBed.inject(ScheduleNavService);
    spaceNavService = TestBed.inject(SpaceNavService);
    errorLogger = TestBed.inject(ErrorLogger);

    mockSpace = {
      id: 'space123',
      brief: { title: 'Test Space' },
    } as ISpaceContext;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('goCalendar', () => {
    it('should navigate to calendar page without query params', async () => {
      await service.goCalendar(mockSpace);

      expect(spaceNavService.navigateForwardToSpacePage).toHaveBeenCalledWith(
        mockSpace,
        'calendar',
        { queryParams: undefined }
      );
    });

    it('should navigate to calendar page with query params', async () => {
      const queryParams = { member: 'user123', date: '2024-01-15' };
      await service.goCalendar(mockSpace, queryParams);

      expect(spaceNavService.navigateForwardToSpacePage).toHaveBeenCalledWith(
        mockSpace,
        'calendar',
        { queryParams }
      );
    });

    it('should return navigation result', async () => {
      const result = await service.goCalendar(mockSpace);
      expect(result).toBe(true);
    });

    it('should handle navigation with only member query param', async () => {
      const queryParams = { member: 'user123' };
      await service.goCalendar(mockSpace, queryParams);

      expect(spaceNavService.navigateForwardToSpacePage).toHaveBeenCalledWith(
        mockSpace,
        'calendar',
        { queryParams }
      );
    });

    it('should handle navigation with only date query param', async () => {
      const queryParams = { date: '2024-01-15' };
      await service.goCalendar(mockSpace, queryParams);

      expect(spaceNavService.navigateForwardToSpacePage).toHaveBeenCalledWith(
        mockSpace,
        'calendar',
        { queryParams }
      );
    });
  });

  describe('goNewHappening', () => {
    it('should navigate to new happening page with type', () => {
      const params = { type: 'single' as const };
      service.goNewHappening(mockSpace, params);

      expect(spaceNavService.navigateForwardToSpacePage).toHaveBeenCalledWith(
        mockSpace,
        'new-happening',
        { queryParams: params }
      );
    });

    it('should navigate to new happening page with weekday', () => {
      const params = { wd: 'mo' as const };
      service.goNewHappening(mockSpace, params);

      expect(spaceNavService.navigateForwardToSpacePage).toHaveBeenCalledWith(
        mockSpace,
        'new-happening',
        { queryParams: params }
      );
    });

    it('should navigate to new happening page with date', () => {
      const params = { date: '2024-01-15' };
      service.goNewHappening(mockSpace, params);

      expect(spaceNavService.navigateForwardToSpacePage).toHaveBeenCalledWith(
        mockSpace,
        'new-happening',
        { queryParams: params }
      );
    });

    it('should navigate to new happening page with all params', () => {
      const params = {
        type: 'recurring' as const,
        wd: 'tu' as const,
        date: '2024-01-15',
      };
      service.goNewHappening(mockSpace, params);

      expect(spaceNavService.navigateForwardToSpacePage).toHaveBeenCalledWith(
        mockSpace,
        'new-happening',
        { queryParams: params }
      );
    });

    it('should handle navigation errors', async () => {
      const params = { type: 'single' as const };
      const error = new Error('Navigation failed');
      const mockErrorHandler = vi.fn();

      vi.spyOn(spaceNavService, 'navigateForwardToSpacePage').mockRejectedValue(error);
      vi.spyOn(errorLogger, 'logErrorHandler').mockReturnValue(mockErrorHandler);

      service.goNewHappening(mockSpace, params);

      // Wait for promise to be handled
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(errorLogger.logErrorHandler).toHaveBeenCalledWith(
        'failed to navigate to new happening page'
      );
    });

    it('should navigate with empty params', () => {
      const params = {};
      service.goNewHappening(mockSpace, params);

      expect(spaceNavService.navigateForwardToSpacePage).toHaveBeenCalledWith(
        mockSpace,
        'new-happening',
        { queryParams: {} }
      );
    });
  });
});
