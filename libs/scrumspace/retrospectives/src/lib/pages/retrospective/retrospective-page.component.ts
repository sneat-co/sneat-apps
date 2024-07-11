import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { filter, first, mergeMap, takeUntil } from 'rxjs/operators';
import { RetrospectiveService } from '../../retrospective.service';
import { Subscription } from 'rxjs';
import { TeamBaseComponent } from '@sneat/team-components';
import { IRecord } from '@sneat/data';
import {
	IRetrospective,
	RetrospectiveStage,
} from '@sneat/scrumspace/scrummodels';
import { TeamService } from '@sneat/team-services';
import { SneatUserService } from '@sneat/auth-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { getMeetingIdFromDate } from '@sneat/meeting';

@Component({
	selector: 'sneat-retrospective',
	templateUrl: './retrospective-page.component.html',
})
export class RetrospectivePageComponent
	extends TeamBaseComponent
	implements OnDestroy
{
	public title = 'Retrospective';
	public retrospective: IRecord<IRetrospective>;
	private retroSub: Subscription;

	constructor(
		readonly changeDetectorRef: ChangeDetectorRef,
		@Inject(ErrorLogger) readonly errorLogger: IErrorLogger,
		readonly teamService: TeamService,
		readonly route: ActivatedRoute,
		readonly userService: SneatUserService,
		readonly navController: NavController,
		private readonly retrospectiveService: RetrospectiveService,
	) {
		super(
			changeDetectorRef,
			route,
			errorLogger,
			navController,
			teamService,
			userService,
		);
		this.trackMeetingIdFromUrl();
	}

	public showPersonalFeedback(): boolean {
		const stage = this.retrospective?.dto?.stage;
		return (
			stage === RetrospectiveStage.upcoming ||
			stage === RetrospectiveStage.feedback
		);
	}

	ngOnDestroy() {
		// super.ngOnDestroy();
		if (this.retroSub) {
			this.retroSub.unsubscribe();
		}
	}

	protected onRetrospectiveIdChanged(): void {
		if (
			this.space?.id &&
			this.retrospective.id &&
			this.retrospective.id !== RetrospectiveStage.upcoming
		) {
			this.watchRetro();
		}
	}

	protected onTeamIdChanged() {
		super.onTeamIdChanged();
		try {
			console.log('RetrospectivePage.onTeamIdChanged()');
			if (this.retrospective?.id) {
				this.watchRetro();
			}
		} catch (e) {
			this.logError(e, 'Failed to process changed team ID');
		}
	}

	private trackMeetingIdFromUrl(): void {
		try {
			this.userService.userChanged
				.pipe(
					filter((uid) => !!uid),
					first(),
					mergeMap(() => this.route.queryParamMap),
					takeUntil(this.destroyed$),
				)
				.subscribe({
					next: (queryParams) => {
						let id = queryParams.get('id');
						switch (id) {
							case 'today':
								id = getMeetingIdFromDate(new Date()); // TODO: replace URL?
								break;
							case RetrospectiveStage.upcoming:
								this.retrospective = {
									id,
									dto: {
										stage: RetrospectiveStage.upcoming,
										userIDs: undefined,
									},
								};
								break;
						}
						if (!this.retrospective) {
							this.retrospective = { id };
							this.onRetrospectiveIdChanged();
						}
					},
					error: (err) =>
						this.errorLogger.logError(err, 'Failed to load retrospective'),
				});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed in track meeting id from URL');
		}
	}

	private watchRetro(): void {
		console.log('RetrospectivePage.watchRetro()');
		this.userService.userChanged
			// .pipe(filter(uid => !!uid))
			.subscribe((userID) => {
				console.log('RetrospectivePage.watchRetro() => userID:', userID);
				try {
					if (this.retroSub) {
						this.retroSub.unsubscribe();
					}
					if (!userID) {
						return;
					}
					const { id } = this.retrospective;
					if (id === RetrospectiveStage.upcoming) {
						return;
					}
					const teamId = this.space.id;
					this.retroSub = this.retrospectiveService
						.watchRetro(teamId, id)
						.pipe(takeUntil(this.destroyed$.asObservable())) // TODO(StackOverflow): Do we need .asObservable() here?
						.subscribe({
							next: (retrospective) =>
								this.setRetro(teamId, { id, dto: retrospective }),
							error: (e) => this.logError(e, 'Failed to watch retrospective'),
						});
				} catch (e) {
					this.logError(e, 'Failed to watchTeam');
				}
			});
	}

	private setRetro(
		teamId: string,
		retrospective: IRecord<IRetrospective>,
	): void {
		console.log('RetrospectivePage.setRetro()');
		try {
			if (
				this.retrospective?.id === retrospective.id &&
				this.space?.id === teamId
			) {
				this.retrospective = retrospective;
			}
		} catch (e) {
			this.logError(e, 'Failed process new retrospective record');
		}
	}
}
