import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NavController } from '@ionic/angular';
import { listAddRemoveAnimation } from '@sneat/animations';
import { IMemberBrief } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IMemberContext, ITeamContext } from '@sneat/team/models';
import { TeamNavService, TeamService } from '@sneat/team/services';
import { SneatUserService } from '@sneat/user';

@Component({
	selector: 'sneat-members-list',
	templateUrl: './members-list.component.html',
	styleUrls: ['./members-list.component.scss'],
	animations: listAddRemoveAnimation,
})
export class MembersListComponent implements OnChanges {
	@Input() team?: ITeamContext;
	@Input() allMembers?: IMemberBrief[];
	@Input() role?: string;
	@Output() selfRemoved = new EventEmitter<void>();

	public members?: IMemberBrief[];
	private selfRemove?: boolean;

	constructor(
		private navService: TeamNavService,
		private navController: NavController,
		private userService: SneatUserService,
		private teamService: TeamService,
		@Inject(ErrorLogger) private errorLogger: IErrorLogger,
	) {
		//
	}

	public id = (_: number, m: IMemberBrief) => m.id;

	public goMember(member?: IMemberBrief): void {
		console.log('TeamPage.goMember()', member);
		if (!this.team) {
			this.errorLogger.logError(
				'Can not navigate to team member without team context',
			);
			return;
		}
		if (!member?.id) {
			throw new Error('!member?.id');
		}
		const memberContext: IMemberContext = {
			id: member.id,
			brief: member,
			team: this.team,
		};
		this.navService.navigateToMember(this.navController, memberContext);
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['allMembers'] || changes['role']) {
			this.members =
				this.role === null
					? this.allMembers
					: this.allMembers?.filter((m) =>
						m.roles?.some((r) => r === this.role),
					);
		}
	}

	// public goAddMember(): void {
	// 	this.navService.navigateToAddMember(this.navController, this.team);
	// }

	public removeMember(event: Event, memberInfo: IMemberBrief) {
		// event.preventDefault();
		event.stopPropagation();
		if (!this.team) {
			return;
		}
		const members = this.team?.dto?.members;
		const memberIndex = members?.findIndex((m) => m.id === memberInfo.id);
		if (members && this.team?.dto?.members) {
			this.team = {
				...this.team,
				dto: {
					...this.team.dto,
					members: members.filter((m) => m.id !== memberInfo.id),
				},
			};
		}
		this.selfRemove = memberInfo.uid === this.userService.currentUserId;
		const teamId = this.team.id;
		this.teamService.removeTeamMember(this.team, memberInfo.id).subscribe({
			next: (team) => {
				if (teamId !== this.team?.id) {
					return;
				}
				this.team = { id: teamId, dto: team };
				console.log('updated team:', team);
				if (this.selfRemove) {
					this.selfRemoved.emit();
				}
				if (
					!team ||
					(this.userService.currentUserId &&
						team.userIds.indexOf(this.userService.currentUserId) < 0)
				) {
					this.navService.navigateToTeams('back');
				}
			},
			error: (err) => {
				this.selfRemove = undefined;
				this.errorLogger.logError(err, 'Failed to remove member from team');
				if (
					members &&
					((!members.find((m) => m.id === memberInfo.id) && memberIndex) ||
						memberIndex === 0)
				) {
					members.splice(memberIndex, 0, memberInfo);
				}
			},
		});
	}
}
