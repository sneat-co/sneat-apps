import { Component, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthStatus, AuthStatuses, SneatAuthStateService } from '@sneat/auth';
import { emptyRelatedPerson, IRelatedPerson } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IJoinTeamInfoResponse, TeamNavService, TeamService } from '@sneat/team/services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const getPinFromUrl: () => string = () => {
	const m = location.hash.match(/[#&]pin=(\d+)($|&)/);
	return m && m[1] || '';
};

@Component({
	selector: 'sneat-join-team',
	templateUrl: './join-team-page.component.html',
})
export class JoinTeamPageComponent implements OnDestroy {
	private readonly destroyed = new Subject<void>();
	private readonly id?: string;
	public inviteInfo?: IJoinTeamInfoResponse;
	public relatedPerson: IRelatedPerson = emptyRelatedPerson;
	public pin?: string;
	public userID?: string;

	get userOwnInvite(): boolean {
		return this.inviteInfo?.invite.from.userID === this.userID;
	}

	private action?: 'join' | 'refuse';

	public status: 'loading' | 'reviewing' | 'joining' | 'refusing' | 'refused' = 'loading';

	public authStatus: AuthStatus = AuthStatuses.authenticating;

	constructor(
		protected readonly route: ActivatedRoute,
		private readonly navService: TeamNavService,
		private readonly teamService: TeamService,
		private readonly authStateService: SneatAuthStateService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
		console.log('JoinTeamPage.constructor()');
		this.getActionFromLocationHash();
		this.id = this.route.snapshot.queryParamMap.get('id') || undefined;
		try {
			this.pin = getPinFromUrl();
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to handle URL query parameters');
		}
		if (this.id && this.pin) {
			const errMsg = 'Failed to get team information';
			this.teamService.getTeamJoinInfo(this.id, this.pin).subscribe({
				next: (response) => {
					console.log('join_team:', response);
					if (response) {
						this.inviteInfo = response;
						if (response.member) {
							this.relatedPerson = {
								...response.member,
								roles: undefined,
							};
						}
						// this.relatedPerson = {
						// 	gender: this.invite.to.
						// }
						if (this.status === 'loading') {
							if (this.authStatus === 'authenticated' && this.action) {
								this.processAction();
							} else {
								this.status = 'reviewing';
							}
						}
					} else {
						this.errorLogger.logError('EmptyResponse', errMsg);
					}
				},
				error: (err) => this.errorLogger.logError(err, errMsg),
			});
		}


		this.authStateService.authState
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: authState => {
					this.userID = authState.user?.uid;
					this.authStatus = authState.status;
					if (authState.status === 'authenticated' && this.inviteInfo) {
						setTimeout(() => {
							this.processAction();
						}, 10);
					}
				},
				error: this.errorLogger.logErrorHandler('failed to get authState'),
			});
	}

	private processAction(): void {
		console.log(`processAction(), authState=${this.authStatus}, action: ${this.action}`);
		switch (this.action) {
			case 'join':
				this.joinTeam();
				break;
			case 'refuse':
				this.refuse();
				break;
		}
	}

	private getActionFromLocationHash(): void {
		const m = location.hash.match(/[#&]action=(\w+)/);
		if (!m) {
			return;
		}
		if (m[1] === 'join' || m[1] === 'refuse') {
			this.action = m[1];
		} else {
			console.warn('Unknown action:', m[1]);
		}
	}

	public ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	public join(): void {
		if (!this.id) {
			return;
		}
		const teamID = this.inviteInfo?.team.id;
		if (!teamID) {
			const m = 'Not able to join a team without ID';
			this.errorLogger.logError(m, undefined, { show: true });
			return;
		}
		if (this.authStatus === 'authenticated') {
			if (this.pin) {
				this.joinTeam();
			} else {
				alert('Please enter the PIN');
			}
		} else {
			this.navService.navigateToLogin({
				queryParams: { to: 'join-team' },
				returnTo: `/join/${this.inviteInfo?.team?.type}?id=${this.id}#pin=${this.pin}&action=join`,
			});
		}
	}

	public refuse(): void {
		if (!this.id || !this.pin) {
			return;
		}
		this.status = 'refusing';
		this.teamService.refuseToJoinTeam(this.id, this.pin).subscribe({
			next: () => {
				this.status = 'refused';
			},
			error: (err) => {
				this.status = 'reviewing';
				this.errorLogger.logError(err, 'Failed to refuse joining a team');
			},
		});
	}

	private joinTeam(): void {
		const team = this.inviteInfo?.team;
		if (!team) {
			this.errorLogger.logError('no team context');
			return;
		}
		if (!this.pin) {
			this.errorLogger.logError('no pin');
			return;
		}
		if (!this.id) {
			this.errorLogger.logError('no invite id');
			return;
		}
		this.status = 'joining';
		const teamID = team.id;
		this.teamService.joinTeam({
			inviteID: this.id,
			teamID: teamID,
			pin: this.pin,
		}).subscribe({
			next: (dto) => {
				const team = { id: teamID, dto, brief: { id: teamID, ...dto } };
				// this.team = newTeam;
				this.navService
					.navigateToTeam(team, undefined)
					.catch(this.errorLogger.logError);
			},
			error: (err) => {
				this.status = 'reviewing';
				this.errorLogger.logError(err, 'Failed to join a team');
			},
		});
	}

}
