import { TestBed } from '@angular/core/testing';
import { Analytics, logEvent, setUserId, setUserProperties } from '@angular/fire/analytics';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { FireAnalyticsService } from './fire-analytics.service';

vi.mock('@angular/fire/analytics', () => ({
  Analytics: class {},
  logEvent: vi.fn(),
  setUserId: vi.fn(),
  setUserProperties: vi.fn(),
}));

describe('FireAnalyticsService', () => {
  let service: FireAnalyticsService;
  let errorLogger: IErrorLogger;
  let analytics: Analytics;

  beforeEach(() => {
    errorLogger = { 
      logError: vi.fn(), 
      logErrorHandler: () => vi.fn() 
    };
    analytics = {} as Analytics;

    TestBed.configureTestingModule({
      providers: [
        FireAnalyticsService,
        {
          provide: ErrorLogger,
          useValue: errorLogger,
        },
        {
          provide: Analytics,
          useValue: analytics,
        },
      ],
    });
    service = TestBed.inject(FireAnalyticsService);
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    it('should log error if errorLogger is not provided', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          FireAnalyticsService,
          {
            provide: ErrorLogger,
            useValue: null,
          },
          {
            provide: Analytics,
            useValue: analytics,
          },
        ],
      });
      TestBed.inject(FireAnalyticsService);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('!errorLogger')
      );
      consoleSpy.mockRestore();
    });

    it('should log error if analytics is not provided', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          FireAnalyticsService,
          {
            provide: ErrorLogger,
            useValue: errorLogger,
          },
          {
            provide: Analytics,
            useValue: null,
          },
        ],
      });
      TestBed.inject(FireAnalyticsService);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('!analytics')
      );
      consoleSpy.mockRestore();
    });
  });

  describe('logEvent', () => {
    it('should call Firebase logEvent with event name and params', () => {
      const eventName = 'test_event';
      const eventParams = { param1: 'value1' };
      const options = { some: 'option' };
      
      service.logEvent(eventName, eventParams, options);
      
      expect(logEvent).toHaveBeenCalledWith(analytics, eventName, eventParams, options);
    });

    it('should log error if logEvent throws', () => {
      const error = new Error('logEvent failed');
      vi.mocked(logEvent).mockImplementationOnce(() => {
        throw error;
      });

      service.logEvent('test_event');

      expect(errorLogger.logError).toHaveBeenCalledWith(
        error,
        'Failed to log event to Firebase analytics',
        { show: false, feedback: false }
      );
    });
  });

  describe('setCurrentScreen', () => {
    it('should call Firebase logEvent with $screen_view', () => {
      const screenName = 'HomeScreen';
      const options = { some: 'option' };
      
      service.setCurrentScreen(screenName, options);
      
      expect(logEvent).toHaveBeenCalledWith(
        analytics,
        '$screen_view',
        { screenName: screenName },
        options
      );
    });

    it('should log error if logEvent throws', () => {
      const error = new Error('logEvent failed');
      vi.mocked(logEvent).mockImplementationOnce(() => {
        throw error;
      });

      service.setCurrentScreen('HomeScreen');

      expect(errorLogger.logError).toHaveBeenCalledWith(
        error,
        'Failed to log screen view to Firebase analytics',
        { show: false, feedback: false }
      );
    });
  });

  describe('identify', () => {
    it('should call setUserId with userID', () => {
      const userID = 'user123';
      
      service.identify(userID);
      
      expect(setUserId).toHaveBeenCalledWith(analytics, userID);
    });

    it('should log error if setUserId throws', () => {
      const error = new Error('setUserId failed');
      vi.mocked(setUserId).mockImplementationOnce(() => {
        throw error;
      });

      service.identify('user123');

      expect(errorLogger.logError).toHaveBeenCalledWith(
        error,
        'Failed to set user id in Firebase analytics',
        { show: false, feedback: false }
      );
    });

    it('should call setUserProperties with userPropertiesToSet', () => {
      const userID = 'user123';
      const userPropsToSet = { name: 'John', age: 30 };
      
      service.identify(userID, userPropsToSet);
      
      expect(setUserProperties).toHaveBeenCalledWith(analytics, userPropsToSet);
    });

    it('should call setUserProperties with userPropertiesToSetOnce', () => {
      const userID = 'user123';
      const userPropsToSetOnce = { email: 'john@test.com' };
      
      service.identify(userID, undefined, userPropsToSetOnce);
      
      expect(setUserProperties).toHaveBeenCalledWith(analytics, userPropsToSetOnce);
    });

    it('should merge userPropertiesToSet and userPropertiesToSetOnce', () => {
      const userID = 'user123';
      const userPropsToSet = { name: 'John' };
      const userPropsToSetOnce = { email: 'john@test.com' };
      
      service.identify(userID, userPropsToSet, userPropsToSetOnce);
      
      expect(setUserProperties).toHaveBeenCalledWith(analytics, {
        name: 'John',
        email: 'john@test.com',
      });
    });

    it('should log error if setUserProperties throws', () => {
      const error = new Error('setUserProperties failed');
      vi.mocked(setUserProperties).mockImplementationOnce(() => {
        throw error;
      });

      service.identify('user123', { name: 'John' });

      expect(errorLogger.logError).toHaveBeenCalledWith(
        error,
        'Failed to set user props in Firebase analytics',
        { show: false, feedback: false }
      );
    });
  });

  describe('loggedOut', () => {
    it('should call setUserId with null', () => {
      service.loggedOut();
      
      expect(setUserId).toHaveBeenCalledWith(analytics, null);
    });

    it('should log error if setUserId throws', () => {
      const error = new Error('setUserId failed');
      vi.mocked(setUserId).mockImplementationOnce(() => {
        throw error;
      });

      service.loggedOut();

      expect(errorLogger.logError).toHaveBeenCalledWith(
        error,
        'Failed to logout user from Firebase analytics',
        { show: false, feedback: false }
      );
    });
  });
});
