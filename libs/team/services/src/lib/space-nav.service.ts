import { Inject, Injectable, NgZone } from '@angular/core';
import { Params } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/common/providers/nav-controller';
import { IContactContext, IContactusSpaceDbo } from '@sneat/contactus-core';
import {
	AnalyticsService,
	IAnalyticsService,
	IIdAndOptionalDbo,
} from '@sneat/core';
import { IRecord } from '@sneat/data';
import { ISpaceDbo } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IRetrospective, IScrumDbo } from '@sneat/scrumspace/scrummodels';
import { ISpaceContext, ISpaceRef } from '@sneat/team-models';

export type ScrumPageTab = 'team' | 'my' | 'risks' | 'qna';

@Injectable({
	providedIn: 'root',
})
export class SpaceNavService {
	constructor(
		private readonly zone: NgZone,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navController: NavController,
		@Inject(AnalyticsService)
		private readonly analyticsService: IAnalyticsService,
	) {}

	public navigateToSpaces(animationDirection?: 'forward' | 'back'): void {
		console.log('navigateToSpaces()');
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
		console.log('navigateToLogin()', options?.queryParams);

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

	public navigateToScrum(
		date: 'today' | 'yesterday' | string,
		space: IRecord<ISpaceDbo>,
		scrum?: IRecord<IScrumDbo>,
		tab?: ScrumPageTab,
	): void {
		console.log(
			`navigateToScrum(date=${date}, space=${space?.id}, tab=${tab}), scrum:`,
			scrum?.dbo,
		);
		this.analyticsService.logEvent('navigateToScrum', {
			date,
			space: space.id,
		});
		this.navController
			.navigateForward('scrum', {
				queryParams: { date, space: space.id },
				state: { space, scrum },
				fragment: tab && `tab=` + tab,
			})
			.catch((err) =>
				this.errorLogger.logError(err, 'Failed to navigate to scrum page'),
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

	public navigateToMember(
		navController: NavController,
		memberContext: IContactContext,
	): void {
		console.log(
			`navigateToMember(team.id=${memberContext?.space?.id}, memberInfo.id=${memberContext?.id})`,
		);
		const id = `${memberContext?.space?.id}:${memberContext?.id}`;
		const { space } = memberContext;
		if (!space) {
			this.errorLogger.logError(
				'not able to navigate to member without team context',
			);
			return;
		}
		this.navForward(
			navController,
			`space/${space.type}/${memberContext.space?.id}/member/${memberContext.id}`,
			{
				state: {
					contact: memberContext,
				},
			},
			{ name: '', params: { id, space: space.id, member: memberContext.id } },
		);
	}

	public navigateToSpace(
		space: ISpaceContext,
		animationDirection?: 'forward' | 'back',
	): Promise<boolean> {
		this.analyticsService.logEvent('navigateToTeam', { space: space.id });
		const url = `space/${space?.type}/${space.id}`;
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

	public navigateToScrums = (
		navController: NavController,
		team: IRecord<ISpaceDbo>,
	): void =>
		this.navToSpacePage(navController, team, 'scrums', 'navigateToScrums');

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

	public navigateToAddMember = (
		navController: NavController,
		team: IIdAndOptionalDbo<IContactusSpaceDbo>,
	): void =>
		this.navToSpacePage(
			navController,
			team,
			'add-member',
			'navigateToAddMember',
		);

	public navigateToRetrospective = (
		navController: NavController,
		team: IRecord<ISpaceDbo>,
		id: string | 'upcoming',
	): void =>
		this.navToSpacePage(
			navController,
			team,
			'retrospective',
			'navigateToRetrospective',
			{ id },
		);

	public navigateToRetroTree(
		date: 'today' | 'yesterday' | string,
		space?: IRecord<ISpaceDbo>,
		retrospective?: IRecord<IRetrospective>,
	): void {
		console.log(
			`navigateToRetroReview(date=${date}, space=${space?.id}), scrum:`,
			retrospective?.dbo,
		);
		if (!space) {
			return;
		}
		this.analyticsService.logEvent('navigateToRetroReview', {
			date,
			space: space.id,
		});
		this.navController
			.navigateForward('retro-tree', {
				queryParams: { date, space: space.id },
				state: { space, retrospective },
			})
			.catch((err) =>
				this.errorLogger.logError(
					err,
					'Failed to navigate to retro review page',
				),
			);
	}

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
		console.log('navigateToTeamPage()', url, navOptions);
		return this.navController.navigateForward(url, navOptions);
	}

	private navForward(
		navController: NavController,
		url: string,
		navOptions: NavigationOptions,
		analyticsEvent: { name: string; params?: Record<string, unknown> },
	): void {
		console.log(
			'navForward()',
			url,
			analyticsEvent.name,
			analyticsEvent.params,
		);
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
		params = { ...(params || {}), space: space.id };
		this.navForward(
			navController,
			url,
			{ queryParams: params, state: { space } },
			{ name: eventName, params },
		);
	};
}
