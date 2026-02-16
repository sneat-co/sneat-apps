import { Injectable, inject } from '@angular/core';
import { Params } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AnalyticsService, IAnalyticsService, ISpaceRef } from '@sneat/core';

type NavigationOptions = NonNullable<
  Parameters<NavController['navigateRoot']>[1]
>;
import { IRecord } from '@sneat/data';
import { ISpaceDbo } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';

export type ScrumPageTab = 'team' | 'my' | 'risks' | 'qna';

@Injectable({
  providedIn: 'root',
})
export class SpaceNavService {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly navController = inject(NavController);
  private readonly analyticsService =
    inject<IAnalyticsService>(AnalyticsService);

  public navigateToSpaces(animationDirection?: 'forward' | 'back'): void {
    this.analyticsService.logEvent('navigateToTeams');
    this.navController
      .navigateRoot('spaces', { animationDirection })
      .catch((err) =>
        this.errorLogger.logError(err, 'Failed to navigate to teams page'),
      );
  }

  public navigateToLogin(options?: {
    returnTo?: string;
    queryParams?: Params;
    // fragment?: string;
  }): void {

    // Do not log `returnTo` as it might holds sensitive info
    this.analyticsService.logEvent('navigateToLogin');

    const navOptions: NavigationOptions = {
      queryParams: options?.queryParams,
      animationDirection: 'back',
    };
    if (options?.returnTo) {
      navOptions.fragment = options.returnTo;
    }
    this.navController
      .navigateRoot('login', navOptions)
      .catch((err) =>
        this.errorLogger.logError(err, 'Failed to navigate to login page'),
      );
  }

  public navigateToUserProfile(): void {
    this.analyticsService.logEvent('navigateToUserProfile');
    this.navController
      .navigateRoot('user-profile')
      .catch((err) =>
        this.errorLogger.logError(err, 'Failed to naviage to user profile'),
      );
  }

  public navigateToSpace(
    space: ISpaceContext,
    animationDirection?: 'forward' | 'back',
  ): Promise<boolean> {
    this.analyticsService.logEvent('navigateToSpace', { spaceID: space.id });
    const url = `space/${space.type || space.brief?.type}/${space.id}`;
    return new Promise<boolean>((resolve, reject) => {
      this.navController
        .navigateRoot(url, {
          state: { space },
          animationDirection,
        })
        .then(resolve)
        .catch((err) => {
          this.errorLogger.logError(
            err,
            'Failed to navigate to team overview page with URL: ' + url,
          );
          reject(err);
        });
    });
  }

  public navigateToAddMetric = (
    navController: NavController,
    team: IRecord<ISpaceDbo>,
  ): void =>
    this.navToSpacePage(
      navController,
      team,
      'add-metric',
      'navigateToAddMetric',
    );

  public navigateBackToSpacePage(
    space: ISpaceContext,
    page: string,
    navOptions: NavigationOptions = {},
  ): Promise<boolean> {
    navOptions.animationDirection = 'back';
    return this.navigateToSpacePage(space, page, navOptions);
  }

  public navigateForwardToSpacePage(
    space: ISpaceContext,
    page: string,
    navOptions: NavigationOptions = {},
  ): Promise<boolean> {
    navOptions.animationDirection = 'forward';
    return this.navigateToSpacePage(space, page, navOptions);
  }

  private navigateToSpacePage(
    space: ISpaceContext,
    page: string,
    navOptions: NavigationOptions,
  ): Promise<boolean> {
    const url = `space/${space?.type}/${space?.id}/${page}`;
    const state = navOptions.state || {};
    navOptions = { ...navOptions, state: { space, ...state } };
    return this.navController.navigateForward(url, navOptions);
  }

  private navForward(
    navController: NavController,
    url: string,
    navOptions: NavigationOptions,
    // _analyticsEvent: { name: string; params?: Record<string, unknown> },
  ): void {
    navController = navController || this.navController;
    // this.analyticsService.logEvent(analyticsEvent.name, analyticsEvent.params);
    navController
      .navigateForward(url, navOptions)
      .catch((err) =>
        this.errorLogger.logError(err, 'Failed to navigate to: ' + url),
      );
  }

  private navToSpacePage = (
    navController: NavController,
    space: ISpaceRef,
    url: string,
    eventName: string,
    params?: Record<string, unknown>,
  ): void => {
    params = { ...params, space: space.id };
    this.navForward(
      navController,
      url,
      { queryParams: params, state: { space } },
      { name: eventName, params },
    );
  };
}
