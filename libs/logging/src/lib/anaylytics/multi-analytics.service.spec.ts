import { MultiAnalyticsService } from './multi-analytics.service';
import { IAnalyticsService } from '@sneat/core';

describe('MultiAnalyticsService', () => {
  let mockAnalyticsService1: IAnalyticsService;
  let mockAnalyticsService2: IAnalyticsService;
  let service: MultiAnalyticsService;

  beforeEach(() => {
    mockAnalyticsService1 = {
      identify: vi.fn(),
      logEvent: vi.fn(),
      setCurrentScreen: vi.fn(),
      loggedOut: vi.fn(),
    };

    mockAnalyticsService2 = {
      identify: vi.fn(),
      logEvent: vi.fn(),
      setCurrentScreen: vi.fn(),
      loggedOut: vi.fn(),
    };

    service = new MultiAnalyticsService([
      mockAnalyticsService1,
      mockAnalyticsService2,
    ]);
  });

  it('should create', () => {
    expect(new MultiAnalyticsService([])).toBeTruthy();
  });

  describe('identify', () => {
    it('should call identify on all analytics services', () => {
      vi.useFakeTimers();
      const userID = 'user123';
      const userProps = { name: 'John' };
      const userPropsOnce = { email: 'john@test.com' };

      service.identify(userID, userProps, userPropsOnce);
      vi.runAllTimers();

      expect(mockAnalyticsService1.identify).toHaveBeenCalledWith(
        userID,
        userProps,
        userPropsOnce,
      );
      expect(mockAnalyticsService2.identify).toHaveBeenCalledWith(
        userID,
        userProps,
        userPropsOnce,
      );
      vi.useRealTimers();
    });
  });

  describe('logEvent', () => {
    it('should call logEvent on all analytics services', () => {
      vi.useFakeTimers();
      const eventName = 'test_event';
      const eventParams = { param1: 'value1' };
      const options = { some: 'option' };

      service.logEvent(eventName, eventParams, options);
      vi.runAllTimers();

      expect(mockAnalyticsService1.logEvent).toHaveBeenCalledWith(
        eventName,
        eventParams,
        options,
      );
      expect(mockAnalyticsService2.logEvent).toHaveBeenCalledWith(
        eventName,
        eventParams,
        options,
      );
      vi.useRealTimers();
    });
  });

  describe('setCurrentScreen', () => {
    it('should call setCurrentScreen on all analytics services', () => {
      const screenName = 'HomeScreen';
      const options = { some: 'option' };

      service.setCurrentScreen(screenName, options);

      expect(mockAnalyticsService1.setCurrentScreen).toHaveBeenCalledWith(
        screenName,
        options,
      );
      expect(mockAnalyticsService2.setCurrentScreen).toHaveBeenCalledWith(
        screenName,
        options,
      );
    });
  });

  describe('loggedOut', () => {
    it('should call loggedOut on all analytics services', () => {
      vi.useFakeTimers();

      service.loggedOut();
      vi.runAllTimers();

      expect(mockAnalyticsService1.loggedOut).toHaveBeenCalled();
      expect(mockAnalyticsService2.loggedOut).toHaveBeenCalled();
      vi.useRealTimers();
    });
  });
});
