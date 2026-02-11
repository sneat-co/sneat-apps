import { Injectable, NgZone, inject } from '@angular/core';
import { Params } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { IMemberBrief } from '@sneat/contactus-core';

type NavigationOptions = NonNullable<
  Parameters<NavController['navigateRoot']>[1]
>;
import { AnalyticsService, IAnalyticsService, IIdAndBrief } from '@sneat/core';
import { IUserSpaceBrief } from '@sneat/auth-models';
// import {IRetrospective} from '@sneat/ext-scrumspace-retrospectives';
import { ISpaceDbo } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
// import {IScrum} from '@sneat/ext-scrumspace-scrummodels';

export type ScrumPageTab = 'team' | 'my' | 'risks' | 'qna';

@Injectable()
export class NavService {
  private readonly zone = inject(NgZone);
  private readonly navController = inject(NavController);
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly analyticsService =
    inject<IAnalyticsService>(AnalyticsService);

  public navigateToSpaces(animationDirection?: 'forward' | 'back'): void {
    console.log('navigateToTeams()');
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
    fragment?: string;
  }): void {
    console.log('navigateToLogin()', options);
    this.analyticsService.logEvent('navigateToLogin', {
      returnTo: options?.returnTo,
    });
    if (options?.returnTo) {
      // Make `to`first parameter for sake of URL readability
      options.queryParams = options && {
        to: options.returnTo,
        ...options.queryParams,
      };
    }
    this.navController
      .navigateRoot('login', { ...options, animationDirection: 'back' })
      .catch((err) =>
        this.errorLogger.logError(err, 'Failed to navigate to login page'),
      );
  }

  // public navigateToScrum(date: 'today' | 'yesterday' | string, team: IRecord<ITeam>, scrum?: IRecord<IScrum>, tab?: ScrumPageTab): void {
  // 	console.log(`navigateToScrum(date=${date}, space=${space?.id}, tab=${tab}), scrum:`, scrum?.data);
  // 	this.analyticsService.logEvent('navigateToScrum', {date, team: team.id});
  // 	this.navController
  // 		.navigateForward('scrum', {
  // 				queryParams: {date, team: team.id},
  // 				state: {team, scrum},
  // 				fragment: tab && `tab=` + tab,
  // 			},
  // 		)
  // 		.catch(err => this.errorLogger.logError(err, 'Failed to navigate to scrum page'));
  // }

  public navigateToUserProfile(): void {
    this.analyticsService.logEvent('navigateToUserProfile');
    this.navController
      .navigateRoot('user-profile')
      .catch((err) =>
        this.errorLogger.logError(err, 'Failed to naviage to user profile'),
      );
  }

  public navigateToMember(
    space: ISpaceContext,
    memberInfo: IIdAndBrief<IMemberBrief>,
  ): void {
    console.log(
      `navigateToMember(team.id=${space.id}, memberInfo.id=${memberInfo.id})`,
    );
    const id = `${space.id}:${memberInfo.id}`;
    this.navForward(
      this.navController,
      'member',
      {
        queryParams: { id },
        state: {
          space,
          memberInfo,
        },
      },
      { name: '', params: { id, space: space.id, member: memberInfo.id } },
    );
  }

  public navigateToSpace(
    id: string,
    spaceInfo?: IUserSpaceBrief,
    space?: ISpaceDbo,
    animationDirection?: 'forward' | 'back',
  ): void {
    this.analyticsService.logEvent('navigateToTeam', { space: id });
    this.navController
      .navigateRoot('space', {
        queryParams: { id },
        state: {
          spaceInfo,
          space,
        },
        animationDirection,
      })
      .catch((err) =>
        this.errorLogger.logError(err, 'Failed to navigate to team page'),
      );
  }

  // public navigateToScrums = (navController: NavController, team: IRecord<ITeam>): void =>
  // 	this.navToSpacePage(navController, team, 'scrums', 'navigateToScrums');
  //
  // public navigateToAddMetric = (navController: NavController, team: IRecord<ITeam>): void =>
  // 	this.navToSpacePage(navController, team, 'add-metric', 'navigateToAddMetric');
  //
  // public navigateToAddMember = (navController: NavController, team: IRecord<ITeam>): void =>
  // 	this.navToSpacePage(navController, team, 'add-member', 'navigateToAddMember');
  //
  // public navigateToRetrospective = (navController: NavController, team: IRecord<ITeam>, id: string | 'upcoming'): void =>
  // 	this.navToSpacePage(navController, team, 'retrospective', 'navigateToRetrospective', {id});
  //
  // public navigateToRetroTree(date: 'today' | 'yesterday' | string, team: IRecord<ITeam>, retrospective?: IRecord<IRetrospective>): void {
  // 	console.log(`navigateToRetroReview(date=${date}, space=${space?.id}), scrum:`, retrospective?.data);
  // 	this.analyticsService.logEvent('navigateToRetroReview', {date, team: team.id});
  // 	this.navController
  // 		.navigateForward('retro-tree', {
  // 				queryParams: {date, team: team.id},
  // 				state: {team, retrospective},
  // 			},
  // 		)
  // 		.catch(err => this.errorLogger.logError(err, 'Failed to navigate to retro review page'));
  // }

  private navForward(
    navController: NavController,
    url: string,
    navOptions: NavigationOptions,
    event: { name: string; params?: Record<string, unknown> },
  ): void {
    console.log('navForward()', event.name, event.params);
    navController = navController || this.navController;
    this.analyticsService.logEvent(event.name, event.params);
    navController
      .navigateForward(url, navOptions)
      .catch((err) =>
        this.errorLogger.logError(err, 'Failed to navigate to: ' + url),
      );
  }

  private navToSpacePage = (
    navController: NavController,
    space: ISpaceContext,
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
