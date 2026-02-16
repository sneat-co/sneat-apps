import {
  IAnalyticsCallOptions,
  IAnalyticsService,
  UserProperties,
} from '@sneat/core';

const prefix = 'MultiAnalyticsService.';

export class MultiAnalyticsService implements IAnalyticsService {
  constructor(private readonly as: readonly IAnalyticsService[]) {
    console.log(
      prefix +
        `.constructor() as=[${as.map((a) => a.constructor.name).join(',')}]`,
    );
  }

  public identify(
    userID: string,
    userPropsToSet?: UserProperties,
    userPropsToSetOnce?: UserProperties,
  ): void {
    this.as.forEach((as) =>
      setTimeout(() => as.identify(userID, userPropsToSet, userPropsToSetOnce)),
    );
  }

  public logEvent(
    eventName: string,
    eventParams?: Readonly<Record<string, unknown>>,
    options?: IAnalyticsCallOptions,
  ): void {
    this.as.forEach((as) =>
      setTimeout(() => as.logEvent(eventName, eventParams, options)),
    );
  }

  public setCurrentScreen(
    screenName: string,
    options?: IAnalyticsCallOptions,
  ): void {
    this.as.forEach((as) => as.setCurrentScreen(screenName, options));
  }

  public loggedOut(): void {
    this.as.forEach((as) => setTimeout(() => as.loggedOut()));
  }
}
