import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TeamService } from '../../../services/src/lib/team.service';
import {
	ChangeDetectorRef,
	Directive,
	Inject,
	Injectable,
	OnDestroy,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { TeamContextService } from '../../../services/src/lib/team-context.service';
import { first, mergeMap, takeUntil } from 'rxjs/operators';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IUserTeamInfoWithId } from '@sneat/auth-models';
import { IRecord } from '@sneat/data';
import { ITeam } from '../../../models/src/lib/models';
import { SneatUserService } from '@sneat/auth';

@Injectable()
@Directive()
export abstract class BaseTeamPageDirective implements OnDestroy {
	public userTeam: IUserTeamInfoWithId;

	protected readonly subs = new Subscription();
	protected readonly destroyed = new Subject<boolean>();
	protected readonly logError = this.errorLogger.logError;

	public get team() {
		return this.teamRecord;
	}

	public get currentUserId() {
		return this.userService.currentUserId;
	}

	public get defaultBackUrl(): string {
		return this.teamRecord?.id ? `team?id=${this.team.id}` : 'teams';
	}

	private teamRecord: IRecord<ITeam>;

	protected constructor(
		protected readonly changeDetectorRef: ChangeDetectorRef,
		protected readonly route: ActivatedRoute,
		@Inject(ErrorLogger) protected readonly errorLogger: IErrorLogger,
		protected readonly navController: NavController,
		protected readonly teamService: TeamService,
		protected readonly teamContextService: TeamContextService,
		protected readonly userService: SneatUserService
	) {
		console.log(`BaseTeamPage.constructor()`);
		try {
			this.getUserTeamInfoFromState();
			this.getTeamRecordFromState();
			this.cleanupOnUserLogout();
		} catch (e) {
			this.logError(e, 'Failed in BaseTeamPageDirective.constructor()');
		}
	}

	public ngOnDestroy() {
		this.unsubscribe('ngOnDestroy');
		this.destroyed.next(true);
		this.destroyed.complete();
	}

	protected unsubscribe(reason: string): void {
		console.log(`unsubscribe(reason: ${reason})`);
		this.subs.unsubscribe();
	}

	protected trackTeamIdFromUrl(teamParamName: string = 'team'): void {
		try {
			this.teamContextService
				.trackUrl(this.route, teamParamName)
				.pipe(takeUntil(this.destroyed))
				.subscribe({
					next: (id) => {
						console.log(
							`BaseTeamPageDirective.trackTeamIdFromUrl() => ${teamParamName}:`,
							id
						);
						this.setTeamId(id);
					},
					error: (err) =>
						this.logError(err, 'Failed to track team ID from url'),
				});
		} catch (e) {
			this.logError(e, 'Failed to call teamContextService.trackUrl()');
		}
	}

	protected onUserIdChanged(): void {
		if (!this.currentUserId) {
			this.subs.unsubscribe();
			if (this.team) {
				this.teamRecord = { id: this.team.id }; // Hide team data
				this.onTeamChanged();
			}
		}
	}

	protected onTeamIdChanged(): void {
		console.log('BaseTeamPageDirective.onTeamIdChanged()');
	}

	protected onTeamChanged(): void {
		console.log('BaseTeamPageDirective.onTeamChanged()');
		this.userTeam = this.teamRecord
			? { id: this.team?.id, title: this.team.data.title }
			: undefined;
	}

	private getUserTeamInfoFromState(): void {
		this.userTeam = history.state?.userTeamInfoWithId;
		if (this.userTeam) {
			this.teamRecord = { id: this.userTeam.id };
			this.onTeamIdChanged();
		}
	}

	private getTeamRecordFromState(): void {
		try {
			this.teamRecord = history.state?.team as IUserTeamInfoWithId;
			if (this.teamRecord) {
				this.onTeamIdChanged();
				this.onTeamChanged();
			}
		} catch (e) {
			this.logError(e, 'Failed in BaseTeamPage.constructor()');
		}
	}

	private cleanupOnUserLogout(): void {
		try {
			this.userService.userChanged.pipe(takeUntil(this.destroyed)).subscribe({
				next: (uid) => {
					if (!uid) {
						this.unsubscribe('user signed out');
						this.teamRecord = undefined;
					}
					this.onUserIdChanged();
				},
				error: (e) => this.logError(e, 'Failed to get user record'),
			});
		} catch (e) {
			this.logError(
				e,
				'Failed to subscribe a hook on page cleanup on user logout'
			);
		}
	}

	private setTeamId(id: string): void {
		try {
			if (id) {
				if (this.teamRecord?.id !== id) {
					console.log(`setTeamId(${id}), previous id=${this.teamRecord?.id}`);
					this.teamRecord = { id };
					this.onTeamIdChanged();
					this.subs.add(
						this.userService.userChanged
							.pipe(
								first(),
								mergeMap(() => this.teamService.watchTeam(id))
							)
							.subscribe({
								next: (data) => this.setTeam({ id, data }),
								error: (err) =>
									this.logError(err, `failed to load team by id=${id}`),
							})
					);
				}
			} else if (this.teamRecord) {
				const hadData = !!this.teamRecord.data;
				const hadId = !!this.teamRecord.id;
				this.teamRecord = undefined;
				if (hadId) {
					this.onTeamIdChanged();
				}
				if (hadData) {
					this.onTeamChanged();
				}
			}
		} catch (e) {
			this.logError(e, 'Failed to set team id');
		}
	}

	private setTeam(team: IRecord<ITeam>): void {
		console.log('BaseTeamPageDirective.setTeam()', team);
		this.teamRecord = team;
		this.onTeamChanged();
	}
}
