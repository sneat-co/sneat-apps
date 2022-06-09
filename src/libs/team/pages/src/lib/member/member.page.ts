import { Component, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IMemberBrief } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { TeamService } from '@sneat/team/services';
import { SneatUserService } from '@sneat/auth';
import { Subscription } from 'rxjs';

@Component({
	selector: 'sneat-member',
	templateUrl: './member.page.html',
	styleUrls: ['./member.page.scss'],
})
// TODO: delete - replaced with TeamMemberPageComponent @memberus
export class MemberPageComponent implements OnDestroy {
	public team?: ITeamContext;

	public userID?: string;
	public memberBrief?: IMemberBrief;
	public changing?: 'role';

	private memberId?: string;
	private teamSubscription?: Subscription;

	constructor(
		readonly route: ActivatedRoute,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navController: NavController,
		private readonly userService: SneatUserService,
		private readonly teamService: TeamService,
	) {
		console.log('MemberPage.constructor()');
		try {
			this.memberBrief = window.history.state.memberInfo as IMemberBrief;
			if (!this.memberId) {
				this.memberId = this?.memberBrief?.id;
			}
			if (this.memberId) {
				if (
					this.memberBrief &&
					this.memberId &&
					this.memberBrief.id !== this.memberId
				) {
					this.errorLogger.logError('this.memberInfo.id !== this.memberId');
					return;
				}
				this.onMemberIdChanged();
			}
			route.queryParamMap.subscribe(
				(params) => {
					this.processUrlParams(params);
				},
				(err) =>
					this.errorLogger.logError(
						err,
						'MemberPage.constructor() => failed to retrieve query parameters',
					),
			);
			this.userService.userChanged.subscribe({
				next: (userID) => {
					this.userID = userID;
				},
				error: (err) =>
					this.errorLogger.logError(
						err,
						'MemberPage.constructor() => userChanged',
					),
			});
		} catch (e) {
			this.errorLogger.logError(e, 'MemberPage.constructor(): unhandled error');
		}
	}

	public get defaultBackUrl(): string {
		return this.team?.id ? `team?id=${this.team.id}` : 'teams';
	}


	public ngOnDestroy(): void {
		if (this.teamSubscription) {
			this.teamSubscription.unsubscribe();
		}
	}

	public changeRole(event: Event): void {
		console.log('changeRole():', event);
		if (!this.team) {
			this.errorLogger.logError('Can not change role without team context');
			return;
		}
		if (!this.memberId) {
			this.errorLogger.logError(
				'Can not change role without knowing member ID',
			);
			return;
		}
		this.changing = 'role';
		const { detail } = event as CustomEvent;
		this.teamService
			.changeMemberRole(this.team, this.memberId, detail.value)
			.subscribe({
				next: () => {
					this.changing = undefined;
				},
				error: (err) => {
					this.changing = undefined;
					this.errorLogger.logError(err, 'Failed to change team member role');
				},
			});
	}

	private processUrlParams(params: ParamMap): void {
		const id = params.get('id');
		if (!id) {
			return;
		}
		const ids = id.split(':');
		console.log('processUrlParams', id);
		if (ids.length === 2) {
			const [teamId, memberId] = ids;
			if (teamId && teamId !== this.team?.id) {
				this.team = { id: teamId };
				this.onTeamIdChanged();
			}
			if (memberId !== this.memberId) {
				this.memberId = memberId;
				this.memberId = memberId;
				this.onMemberIdChanged();
			}
		}
	}

	private onTeamIdChanged(): void {
		if (this.teamSubscription) {
			this.teamSubscription.unsubscribe();
		}
		this.memberId = undefined;
		const teamId = this.team?.id;
		if (this.team && teamId) {
			this.teamSubscription = this.teamService.watchTeam(this.team).subscribe({
				next: team => {
					console.log('MemberPage: teamService.watchTeam =>', team);

					if (this.team?.id !== teamId) {
						return;
					}
					this.team = team;
					if (this.memberId) {
						this.onMemberIdChanged();
					}
				},
				error: (err) =>
					this.errorLogger.logError(
						err,
						'MemberPage.onTeamIdChanged() => Failed to get team',
					),
			});
		}
	}

	private onMemberIdChanged(): void {
		if (this.team) {
			const memberId = this.memberId;
			this.memberBrief = this.team?.dto?.members?.find(
				m => m.id === memberId,
			);
		}
	}
}
