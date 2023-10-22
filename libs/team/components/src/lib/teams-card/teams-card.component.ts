import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonInput, ToastController } from '@ionic/angular';
import { AnalyticsService, IAnalyticsService } from '@sneat/core';
import { IUserTeamBrief } from '@sneat/auth-models';
import { IIdAndBrief } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ContactService } from '@sneat/contactus-services';
import { ICreateTeamRequest, ITeamContext } from '@sneat/team/models';
import { TeamNavService, TeamService } from '@sneat/team/services';
import { ISneatUserState, SneatUserService } from '@sneat/auth-core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'sneat-teams-card',
	templateUrl: './teams-card.component.html',
})
export class TeamsCardComponent implements OnInit, OnDestroy {
	@ViewChild(IonInput, { static: false }) addTeamInput?: IonInput; // TODO: IonInput;

	public teams?: IIdAndBrief<IUserTeamBrief>[];
	public loadingState: 'Authenticating' | 'Loading' = 'Authenticating';
	public teamName = '';
	public adding = false;
	public showAdd = false; //
	private readonly destroyed = new Subject<void>();
	private subscriptions: Subscription[] = [];

	protected readonly id = (_: number, o: { id: string }) => o.id;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navService: TeamNavService,
		private readonly userService: SneatUserService,
		private readonly teamService: TeamService,
		private readonly contactService: ContactService,
		@Inject(AnalyticsService)
		private readonly analyticsService: IAnalyticsService,
		private readonly toastController: ToastController,
	) {}

	public ngOnDestroy(): void {
		console.log('TeamsCardComponent.ngOnDestroy()');
		this.destroyed.next();
		this.destroyed.complete();
		this.unsubscribe('ngOnDestroy');
	}

	public ngOnInit(): void {
		this.watchUserRecord();
	}

	public goTeam(team: ITeamContext) {
		this.navService
			.navigateToTeam(team, 'forward')
			.catch(this.errorLogger.logError);
	}

	public addTeam() {
		this.analyticsService.logEvent('addTeam');
		const title = this.teamName.trim();
		if (!title) {
			this.toastController
				.create({
					position: 'middle',
					message: 'Team name is required',
					color: 'tertiary',
					duration: 5000,
					keyboardClose: true,
					buttons: [{ role: 'cancel', text: 'OK' }],
				})
				.then((toast) =>
					toast
						.present()
						.catch((err) =>
							this.errorLogger.logError(err, 'Failed to present toast'),
						),
				)
				.catch((err) =>
					this.errorLogger.logError(err, 'Faile to create toast'),
				);
			return;
		}
		if (this.teams?.find((t) => t.brief.title === title)) {
			this.toastController
				.create({
					message: 'You already have a team with the same name',
					color: 'danger',
					buttons: ['close'],
					position: 'middle',
					animated: true,
					duration: 3000,
				})
				.then((toast) => {
					toast
						.present()
						.catch((err) =>
							this.errorLogger.logError(err, 'Failed to present toast'),
						);
				})
				.catch((err) =>
					this.errorLogger.logError(err, 'Failed to create toast'),
				);
			return;
		}
		const request: ICreateTeamRequest = {
			type: 'team',
			// memberType: TeamMemberType.creator,
			title,
		};
		this.adding = true;
		this.teamService.createTeam(request).subscribe({
			next: (team) => {
				this.analyticsService.logEvent('teamCreated', { team: team.id });
				console.log('teamId:', team.id);
				const userTeam: IUserTeamBrief = {
					title: team?.dto?.title || team.id,
					roles: ['creator'],
					// memberType: request.memberType,
					type: team?.dto?.type || 'unknown',
				};
				if (userTeam && !this.teams?.find((t) => t.id === team.id)) {
					this.teams?.push({ id: team.id, brief: userTeam });
				}
				this.adding = false;
				this.teamName = '';
				this.goTeam(team);
			},
			error: (err) => {
				this.errorLogger.logError(err, 'Failed to create new team record');
				this.adding = false;
			},
		});
	}

	public startAddingTeam(): void {
		this.showAdd = true;
		setTimeout(() => {
			if (!this.addTeamInput) {
				this.errorLogger.logError('addTeamInput is not set');
				return;
			}
			this.addTeamInput
				.setFocus()
				.catch((err) =>
					this.errorLogger.logError(
						err,
						'Failed to set focus to "addTeamInput"',
					),
				);
		}, 100);
	}

	public leaveTeam(team: IIdAndBrief<IUserTeamBrief>, event?: Event): void {
		if (event) {
			event.stopPropagation();
			event.preventDefault();
		}
		if (!confirm(`Are you sure you want to leave team ${team.brief.title}?`)) {
			return;
		}
		const userID = this.userService.currentUserID;
		if (!userID) {
			this.errorLogger.logError('Failed to get current user ID');
			return;
		}
		this.contactService.removeTeamMember(team.id, userID).subscribe({
			next: (response: unknown) => console.log('left team:', response),
			error: (err: unknown) =>
				this.errorLogger.logError(
					err,
					`Failed to leave a team: ${team.brief.title}`,
				),
		});
	}

	private watchUserRecord(): void {
		this.userService.userState.pipe(takeUntil(this.destroyed)).subscribe({
			next: (userState) => {
				console.log('TeamsCardComponent => user state changed:', userState);
				if (userState.status === 'authenticating') {
					if (this.loadingState === 'Authenticating') {
						this.loadingState = 'Loading';
					}
				}
				const uid = userState.user?.uid;
				this.teams = undefined;
				if (!uid) {
					this.unsubscribe('user signed out');
					return;
				}
				this.subscriptions.push(
					this.userService.userState.subscribe({
						next: this.setUser,
						error: (err) =>
							this.errorLogger.logError(err, 'Failed to get user record'),
					}),
				);
			},
			error: (err) => this.errorLogger.logError(err, 'Failed to get user ID'),
		});
	}

	private unsubscribe(reason?: string): void {
		console.log(`TeamsCardComponent.unsubscribe(reason: ${reason})`);
		this.subscriptions.forEach((s) => s.unsubscribe());
		this.subscriptions = [];
	}

	private setUser = (userState: ISneatUserState): void => {
		console.log('TeamsCardComponent => user:', userState);
		const user = userState.record;
		if (user) {
			this.teams = Object.entries(user?.teams ? user.teams : {}).map(
				([id, team]) => ({ id, brief: team }),
			);
			this.teams.sort((a, b) => (a.brief.title > b.brief.title ? 1 : -1));
			this.showAdd = !this.teams?.length;
			if (this.showAdd) {
				this.startAddingTeam();
			}
		} else {
			this.teams = undefined;
		}
	};
}
