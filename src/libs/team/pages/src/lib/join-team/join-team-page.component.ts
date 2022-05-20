import { Component, Inject, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import { IUserTeamBrief } from '@sneat/auth-models';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { IJoinTeamInfoResponse, TeamNavService, TeamService } from '@sneat/team/services';
import { Subscription } from 'rxjs';

export const getPinFromUrl: () => number | undefined = () => {
	const m = location.hash.match(/[#&]pin=(\d+)($|&)/);
	if (m) {
		return +m[1];
	}
	return undefined;
};

@Component({
	selector: 'sneat-join-team',
	templateUrl: './join-team-page.component.html',
})
export class JoinTeamPageComponent implements OnDestroy {
	private id?: string;
	public invite?: IJoinTeamInfoResponse;
	public pin?: number;
	public joining?: boolean;
	public refusing?: boolean;
	public isUserAuthenticated?: boolean;

	private subscriptions: Subscription[] = [];

	constructor(
		protected readonly route: ActivatedRoute,
		private readonly navService: TeamNavService,
		private readonly teamService: TeamService,
		private readonly afAuth: AngularFireAuth,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
		console.log('JoinTeamPage.constructor()');
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
						this.invite = response;
					} else {
						this.errorLogger.logError('EmptyResponse', errMsg);
					}
				},
				error: (err) => this.errorLogger.logError(err, errMsg),
			});
		}

		this.subscriptions.push(
			this.afAuth.idToken.subscribe((token) => {
				this.isUserAuthenticated = !!token;
				if (this.isUserAuthenticated) {
					const m = location.hash.match(/[#&]action=(\w+)/);
					console.log('m:', m);
					if (m && this.invite?.team?.id && this.pin) {
						switch (m[1]) {
							case 'join':
								this.joinTeam();
								break;
							case 'refuse':
								this.refuseToJoinTeam(this.invite.team?.id, this.pin);
								break;
							default:
								console.warn('Unknown action:', m[1]);
						}
					}
				}
			}),
		);
	}

	public ngOnDestroy(): void {
		this.unsubscribe();
	}

	public join(): void {
		const teamID = this.invite?.team.id;
		if (!teamID) {
			const m = 'Not able to join a team without ID';
			this.errorLogger.logError(m, undefined, { show: true });
			return;
		}
		if (this.isUserAuthenticated) {
			if (this.pin) {
				this.joinTeam();
			} else {
				alert('Please enter the PIN');
			}
		} else {
			this.navService.navigateToLogin({
				returnTo: 'join-team',
				queryParams: { id: teamID },
				fragment: `pin=${this.pin}&action=join`,
			});
		}
	}

	public refuse(): void {
		const id = this.invite?.team?.id;
		if (this.isUserAuthenticated) {
			if (!id) {
				this.errorLogger.logError('no team ID', undefined, { show: true });
				return;
			}
			if (!this.pin) {
				this.errorLogger.logError('no PIN', undefined, { show: true });
				return;
			}
			this.refuseToJoinTeam(id, this.pin);
		} else {
			this.navService.navigateToLogin({
				returnTo: 'join-team',
				queryParams: { id },
				fragment: `pin=${this.pin}&action=refuse`,
			});
		}
	}

	private unsubscribe(): void {
		this.subscriptions.forEach((s) => s.unsubscribe());
		this.subscriptions = [];
	}

	private joinTeam(): void {
		const team = this.invite?.team;
		if (!team) {
			this.errorLogger.logError('no team context');
			return;
		}
		if (!this.pin) {
			this.errorLogger.logError('no pin');
			return;
		}
		this.joining = true;
		const teamID = team.id;
		this.teamService.joinTeam(teamID, this.pin).subscribe({
			next: (dto) => {
				const team = {id: teamID, dto, brief: {id: teamID, ...dto}}
				// this.team = newTeam;
				this.navService
					.navigateToTeam(team, undefined)
					.catch(this.errorLogger.logError);
			},
			error: (err) => {
				this.joining = false;
				this.errorLogger.logError(err, 'Failed to join team');
			},
		});
	}

	private refuseToJoinTeam(id: string, pin: number): void {
		this.refusing = true;
		this.teamService.refuseToJoinTeam(id, pin).subscribe({
			next: () => this.navService.navigateToTeams('forward'),
			error: (err) => {
				this.refusing = false;
				this.errorLogger.logError(err, 'Failed to join team');
			},
		});
	}
}
