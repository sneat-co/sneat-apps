import {Inject, Injectable, NgZone} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Params} from '@angular/router';
import {NavigationOptions} from '@ionic/angular/providers/nav-controller';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {AnalyticsService, IAnalyticsService} from '@sneat/analytics';
import {IMemberInfo, ITeam} from '@sneat/team-models';
import {IUserTeamInfoWithId} from '@sneat/auth-models';
import {IRetrospective} from '@sneat/scrumspace/retrospectives';
import {IRecord} from '@sneat/data';
import {IScrum} from '@sneat/scrumspace/scrummodels';

export type ScrumPageTab = 'team' | 'my' | 'risks' | 'qna';

@Injectable()
export class NavService { // TODO: Should it be inside the /libs/datatug/services/nav/ folder?

	constructor(
		private readonly zone: NgZone,
		private readonly navController: NavController,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		@Inject(AnalyticsService) private readonly analyticsService: IAnalyticsService,
	) {
	}

	public navigateToTeams(animationDirection?: 'forward' | 'back'): void {
		console.log('navigateToTeams()');
		this.analyticsService.logEvent('navigateToTeams');
		this.navController.navigateRoot('teams', {animationDirection})
			.catch(err => this.errorLogger.logError(err, 'Failed to navigate to teams page'));
	}

	public navigateToLogin(options?: { returnTo?: string; queryParams?: Params, fragment?: string }): void {
		console.log('navigateToLogin()', options);
		this.analyticsService.logEvent('navigateToLogin', {returnTo: options.returnTo});
		if (options.returnTo) {
			// Make `to`first parameter for sake of URL readability
			options.queryParams = options && {to: options.returnTo, ...options.queryParams};
		}
		this.navController.navigateRoot('login', {...options, animationDirection: 'back'})
			.catch(err => this.errorLogger.logError(err, 'Failed to navigate to login page'));
	}

	public navigateToScrum(date: 'today' | 'yesterday' | string, team: IRecord<ITeam>, scrum?: IRecord<IScrum>, tab?: ScrumPageTab): void {
		console.log(`navigateToScrum(date=${date}, team=${team?.id}, tab=${tab}), scrum:`, scrum?.data);
		this.analyticsService.logEvent('navigateToScrum', {date, team: team.id});
		this.navController
			.navigateForward('scrum', {
					queryParams: {date, team: team.id},
					state: {team, scrum},
					fragment: tab && `tab=` + tab,
				},
			)
			.catch(err => this.errorLogger.logError(err, 'Failed to navigate to scrum page'));
	}


	public navigateToUserProfile(): void {
		this.analyticsService.logEvent('navigateToUserProfile');
		this.navController.navigateRoot('user-profile')
			.catch(err => this.errorLogger.logError(err, 'Failed to naviage to user profile'));
	}

	public navigateToMember(navController: NavController, team: IRecord<ITeam>, memberInfo: IMemberInfo): void {
		console.log(`navigateToMember(team.id=${team.id}, memberInfo.id=${memberInfo.id})`);
		const id = `${team.id}:${memberInfo.id}`;
		this.navForward(navController, 'member', {
			queryParams: {id},
			state: {
				team,
				memberInfo,
			}
		}, {name: '', params: {id, team: team.id, member: memberInfo.id}});
	}

	public navigateToTeam(id: string, teamInfo?: IUserTeamInfoWithId, team?: ITeam, animationDirection?: 'forward' | 'back'): void {
		this.analyticsService.logEvent('navigateToTeam', {team: id});
		this.navController.navigateRoot('team', {
				queryParams: {id},
				state: {
					teamInfo,
					team,
				},
				animationDirection,
			}
		).catch(err => this.errorLogger.logError(err, 'Failed to navigate to team page'));
	}

	public navigateToScrums = (navController: NavController, team: IRecord<ITeam>): void =>
		this.navToTeamPage(navController, team, 'scrums', 'navigateToScrums');

	public navigateToAddMetric = (navController: NavController, team: IRecord<ITeam>): void =>
		this.navToTeamPage(navController, team, 'add-metric', 'navigateToAddMetric');

	public navigateToAddMember = (navController: NavController, team: IRecord<ITeam>): void =>
		this.navToTeamPage(navController, team, 'add-member', 'navigateToAddMember');

	public navigateToRetrospective = (navController: NavController, team: IRecord<ITeam>, id: string | 'upcoming'): void =>
		this.navToTeamPage(navController, team, 'retrospective', 'navigateToRetrospective', {id});

	public navigateToRetroTree(date: 'today' | 'yesterday' | string, team: IRecord<ITeam>, retrospective?: IRecord<IRetrospective>): void {
		console.log(`navigateToRetroReview(date=${date}, team=${team?.id}), scrum:`, retrospective?.data);
		this.analyticsService.logEvent('navigateToRetroReview', {date, team: team.id});
		this.navController
			.navigateForward('retro-tree', {
					queryParams: {date, team: team.id},
					state: {team, retrospective},
				},
			)
			.catch(err => this.errorLogger.logError(err, 'Failed to navigate to retro review page'));
	}

	private navForward(
		navController: NavController,
		url: string,
		navOptions: NavigationOptions,
		event: { name: string; params?: any },
	): void {
		console.log('navForward()', event.name, event.params);
		navController = navController || this.navController;
		this.analyticsService.logEvent(event.name, event.params);
		navController.navigateForward(url, navOptions)
			.catch(err => this.errorLogger.logError(err, 'Failed to navigate to: ' + url));
	}

	private navToTeamPage = (navController: NavController, team: IRecord<ITeam>, url: string, eventName: string, params?: any): void => {
		params = {...params || {}, team: team.id};
		this.navForward(navController, url, {queryParams: params, state: {team}}, {name: eventName, params})
	}
}
