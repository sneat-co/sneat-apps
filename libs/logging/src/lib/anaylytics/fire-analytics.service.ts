import { inject, Injectable } from '@angular/core';
import {
  Analytics,
  logEvent,
  setUserId,
  setUserProperties,
} from '@angular/fire/analytics';
import { ErrorLogger, IErrorLogger, ILogErrorOptions } from '@sneat/core';
import {
  IAnalyticsCallOptions,
  IAnalyticsService,
  UserProperties,
} from '@sneat/core';

const logErrOptions: ILogErrorOptions = { show: false, feedback: false };

@Injectable()
export class FireAnalyticsService implements IAnalyticsService {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly analytics = inject(Analytics);

  constructor() {
    if (!this.errorLogger) {
      console.error(`FireAnalyticsService() - !errorLogger`);
    }
    if (!this.analytics) {
      console.error(`FireAnalyticsService() - !analytics`);
    }
  }

  private readonly logError = (e: unknown, m: string) =>
    this.errorLogger.logError(e, m, logErrOptions);

  public logEvent(
    eventName: string,
    eventParams?: Record<string, unknown>,
    options?: IAnalyticsCallOptions,
  ): void {
    try {
      logEvent(this.analytics, eventName, eventParams, options);
    } catch (e) {
      this.logError(e, 'Failed to log event to Firebase analytics');
    }
  }

  public setCurrentScreen(
    screenName: string,
    options?: IAnalyticsCallOptions,
  ): void {
    try {
      const args = { screenName: screenName };
      logEvent(this.analytics, '$screen_view', args, options);
    } catch (e) {
      this.logError(e, 'Failed to log screen view to Firebase analytics');
    }
  }

  public identify(
    userID: string,
    userPropertiesToSet?: UserProperties,
    userPropertiesToSetOnce?: UserProperties,
  ): void {
    try {
      setUserId(this.analytics, userID);
    } catch (e) {
      this.logError(e, 'Failed to set user id in Firebase analytics');
    }
    const customProperties: { [id: string]: unknown } = {};

    if (userPropertiesToSet)
      Object.keys(userPropertiesToSet).forEach(
        (k) => (customProperties[k] = userPropertiesToSet[k]),
      );
    if (userPropertiesToSetOnce)
      Object.keys(userPropertiesToSetOnce).forEach(
        (k) => (customProperties[k] = userPropertiesToSetOnce[k]),
      );
    try {
      setUserProperties(this.analytics, customProperties);
    } catch (e) {
      this.logError(e, 'Failed to set user props in Firebase analytics');
    }
  }

  public loggedOut(): void {
    try {
      setUserId(this.analytics, null);
    } catch (e) {
      this.logError(e, 'Failed to logout user from Firebase analytics');
    }
  }
}
