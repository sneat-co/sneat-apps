import { Component, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ContactService } from '@sneat/contactus-services';
import { IContactContext, IContactusTeamDtoWithID, ITeamContext } from '@sneat/team/models';
import { SneatUserService } from '@sneat/auth-core';
import { TeamService } from '@sneat/team/services';
import { Subscription } from 'rxjs';

@Component({
	selector: 'sneat-member',
	templateUrl: './member.page.html',
	styleUrls: ['./member.page.scss'],
})
export class MemberPageComponent implements OnDestroy {

	protected team?: ITeamContext;
	protected contactusTeam?: IContactusTeamDtoWithID;

	public userID?: string;


	public member?: IContactContext;
	public changing?: 'role';

	private teamSubscription?: Subscription;

	constructor(
		readonly route: ActivatedRoute,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navController: NavController,
		private readonly userService: SneatUserService,
		private readonly teamService: TeamService,
		private readonly contactService: ContactService,
	) {
		console.log('MemberPage.constructor()');
		try {
			this.member = window.history.state.memberInfo as IContactContext;
			if (this.member?.id) {
				this.onMemberIdChanged();
			}
			route.queryParamMap.subscribe({
					next: params => this.processUrlParams(params),
					error: (err: unknown) =>
						this.errorLogger.logError(
							err,
							'MemberPage.constructor() => failed to retrieve query parameters',
						),
				},
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
		return this.contactusTeam?.id ? `team?id=${this.contactusTeam.id}` : 'teams';
	}


	public ngOnDestroy(): void {
		if (this.teamSubscription) {
			this.teamSubscription.unsubscribe();
		}
	}

	public changeRole(event: Event): void {
		console.log('changeRole():', event);
		if (!this.contactusTeam?.id) {
			this.errorLogger.logError('Can not change role without team context');
			return;
		}
		const memberID = this.member?.id;
		if (!memberID) {
			this.errorLogger.logError(
				'Can not change role without knowing member ID',
			);
			return;
		}
		this.changing = 'role';
		const { detail } = event as CustomEvent;
		this.contactService
			.changeContactRole(this.contactusTeam.id, memberID, detail.value)
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
			if (teamId && teamId !== this.contactusTeam?.id) {
				this.contactusTeam = { id: teamId };
				this.onTeamIdChanged();
			}
			if (memberId !== this.member?.id) {
				this.member = { id: memberId, team: { id: teamId } };
				this.onMemberIdChanged();
			}
		}
	}

	private onTeamIdChanged(): void {
		if (this.teamSubscription) {
			this.teamSubscription.unsubscribe();
		}
		this.member = undefined;
		const team = this.team;
		if (team) {
			this.teamSubscription = this.teamService.watchTeam(team).subscribe({
				next: team => {
					console.log('MemberPage: teamService.watchTeam =>', team);

					if (this.team?.id !== team.id) {
						return;
					}
					this.team = team;
					if (this.member?.id) {
						this.onMemberIdChanged();
					}
				},
				error: (err: unknown) =>
					this.errorLogger.logError(
						err,
						'MemberPage.onTeamIdChanged() => Failed to get team',
					),
			});
		}
	}

	private onMemberIdChanged(): void {
		if (this.contactusTeam && this.member?.id && !this.member?.dto) {
			this.member = { ...this.member, brief: this.contactusTeam?.dto?.contacts[this.member.id] };
		}
	}
}
