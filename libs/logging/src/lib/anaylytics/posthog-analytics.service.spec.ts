import { TestBed } from '@angular/core/testing';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { PosthogAnalyticsService } from './posthog-analytics.service';
import posthog from 'posthog-js';

vi.mock('posthog-js', () => ({
  default: {
    identify: vi.fn(),
    capture: vi.fn(),
    reset: vi.fn(),
  },
}));

describe('PosthogAnalyticsService', () => {
  let service: PosthogAnalyticsService;
  let errorLogger: IErrorLogger;

  beforeEach(() => {
    errorLogger = { 
      logError: vi.fn(), 
      logErrorHandler: () => vi.fn() 
    };

    TestBed.configureTestingModule({
      providers: [
        PosthogAnalyticsService,
        {
          provide: ErrorLogger,
          useValue: errorLogger,
        },
      ],
    });
    service = TestBed.inject(PosthogAnalyticsService);
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('identify', () => {
    it('should call posthog identify with userID', () => {
      const userID = 'user123';
      service.identify(userID);
      expect(posthog.identify).toHaveBeenCalledWith(userID);
    });
  });

  describe('logEvent', () => {
    it('should call posthog capture with event name and params', () => {
      const eventName = 'test_event';
      const eventParams = { param1: 'value1' };
      
      service.logEvent(eventName, eventParams);
      
      expect(posthog.capture).toHaveBeenCalledWith(eventName, eventParams);
    });

    it('should log error if capture throws', () => {
      const error = new Error('capture failed');
      vi.mocked(posthog.capture).mockImplementationOnce(() => {
        throw error;
      });

      service.logEvent('test_event');

      expect(errorLogger.logError).toHaveBeenCalledWith(
        error,
        'Failed to log event to Posthog',
        { show: false }
      );
    });
  });

  describe('setCurrentScreen', () => {
    it('should call posthog capture with $screen_view event', () => {
      const screenName = 'HomeScreen';
      
      service.setCurrentScreen(screenName);
      
      expect(posthog.capture).toHaveBeenCalledWith('$screen_view', {
        screen_name: screenName,
      });
    });

    it('should log error if capture throws', () => {
      const error = new Error('capture failed');
      vi.mocked(posthog.capture).mockImplementationOnce(() => {
        throw error;
      });

      service.setCurrentScreen('HomeScreen');

      expect(errorLogger.logError).toHaveBeenCalledWith(
        error,
        'Failed to log screen view to Posthog',
        { show: false }
      );
    });
  });

  describe('loggedOut', () => {
    it('should call posthog reset', () => {
      service.loggedOut();
      expect(posthog.reset).toHaveBeenCalled();
    });

    it('should log error if reset throws', () => {
      const error = new Error('reset failed');
      vi.mocked(posthog.reset).mockImplementationOnce(() => {
        throw error;
      });

      service.loggedOut();

      expect(errorLogger.logError).toHaveBeenCalledWith(
        error,
        'Failed to reset Posthog',
        { show: false }
      );
    });
  });
});
