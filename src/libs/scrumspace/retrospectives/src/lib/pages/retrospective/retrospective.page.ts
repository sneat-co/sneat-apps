import {ChangeDetectorRef, Component, Inject, OnDestroy} from '@angular/core';
import {IRecord, IRetrospective, RetrospectiveStage} from '../../../models/interfaces';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../../services/user-service';
import {TeamContextService} from '../../../services/team-context.service';
import {TeamService} from '../../../services/team.service';
import {BaseTeamPageDirective} from '../../../pages/base-team-page-directive';
import {ErrorLogger, IErrorLogger} from '@sneat-team/ui-core';
import {NavController} from '@ionic/angular';
import {filter, first, mergeMap, takeUntil} from 'rxjs/operators';
import {RetrospectiveService} from '../../retrospective.service';
import {Subscription} from 'rxjs';
import {getMeetingIdFromDate} from '../../../services/meeting.service';

@Component({
	selector: 'app-retrospective',
	templateUrl: './retrospective.page.html',
	styleUrls: ['./retrospective.page.scss'],
})
export class RetrospectivePage extends BaseTeamPageDirective implements OnDestroy {

	public title = 'Retrospective';
	public retrospective: IRecord<IRetrospective>;
	private retroSub: Subscription;

	constructor(
		readonly changeDetectorRef: ChangeDetectorRef,
		@Inject(ErrorLogger) readonly errorLogger: IErrorLogger,
		readonly teamContextService: TeamContextService,
		readonly teamService: TeamService,
		readonly route: ActivatedRoute,
		readonly userService: UserService,
		readonly navController: NavController,
		private readonly retrospectiveService: RetrospectiveService,
	) {
		super(changeDetectorRef, route, errorLogger, navController, teamService, teamContextService, userService);
		this.trackTeamIdFromUrl();
		this.trackMeetingIdFromUrl();
	}

	public showPersonalFeedback(): boolean {
		const stage = this.retrospective?.data?.stage;
		return stage === RetrospectiveStage.upcoming || stage === RetrospectiveStage.feedback;
	}

	ngOnDestroy() {
		super.ngOnDestroy();
		if (this.retroSub) {
			this.retroSub.unsubscribe();
		}
	}

	protected onRetrospectiveIdChanged(): void {
		if (this.team?.id && this.retrospective.id && this.retrospective.id !== RetrospectiveStage.upcoming) {
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
			this.userService.userChanged.pipe(
				filter(uid => !!uid),
				first(),
				mergeMap(() => this.route.queryParamMap),
				takeUntil(this.destroyed)
			).subscribe({
				next: queryParams => {
					let id = queryParams.get('id')
					switch (id) {
						case 'today':
							id = getMeetingIdFromDate(new Date()); // TODO: replace URL?
							break;
						case RetrospectiveStage.upcoming:
							this.retrospective = {
								id,
								data: {
									stage: RetrospectiveStage.upcoming,
									userIds: undefined,
								},
							};
							break;
					}
					if (!this.retrospective) {
						this.retrospective = {id};
						this.onRetrospectiveIdChanged()
					}
				},
				error: err => this.errorLogger.logError(err, 'Failed to load retrospective'),
			});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed in track meeting id from URL');
		}
	}

	private watchRetro(): void {
		console.log('RetrospectivePage.watchRetro()');
		this.userService.userChanged
			// .pipe(filter(uid => !!uid))
			.subscribe(userId => {
				console.log('RetrospectivePage.watchRetro() => userId:', userId);
				try {
					if (this.retroSub) {
						this.retroSub.unsubscribe();
					}
					if (!userId) {
						return;
					}
					const {id} = this.retrospective;
					if (id === RetrospectiveStage.upcoming) {
						return;
					}
					const teamId = this.team.id;
					this.retroSub = this.retrospectiveService.watchRetro(teamId, id)
						.pipe(takeUntil(this.destroyed.asObservable())) // TODO(StackOverflow): Do we need .asObservable() here?
						.subscribe({
							next: retrospective => this.setRetro(teamId, {id, data: retrospective}),
							error: e => this.logError(e, 'Failed to watch retrospective'),
						});
				} catch (e) {
					this.logError(e, 'Failed to watchTeam');
				}
			});
	}

	private setRetro(teamId: string, retrospective: IRecord<IRetrospective>): void {
		console.log('RetrospectivePage.setRetro()');
		try {
			if (this.retrospective?.id === retrospective.id && this.team?.id === teamId) {
				this.retrospective = retrospective;
			}
		} catch (e) {
			this.logError(e, 'Failed process new retrospective record');
		}
	}
}
