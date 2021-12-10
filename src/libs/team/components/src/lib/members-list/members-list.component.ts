import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { listAddRemoveAnimation } from '@sneat/animations';
import { IRecord } from '@sneat/data';
import { SneatUserService } from '@sneat/user';
import { IMemberInfo, ITeam, MemberRole, MemberRoleEnum } from "@sneat/team/models";
import { TeamNavService, TeamService } from "@sneat/team/services";

@Component({
	selector: 'sneat-members-list',
	templateUrl: './members-list.component.html',
	styleUrls: ['./members-list.component.scss'],
	animations: listAddRemoveAnimation,
})
export class MembersListComponent implements OnChanges {
	@Input() team?: IRecord<ITeam>;
	@Input() allMembers?: IMemberInfo[];
	@Input() role?: MemberRole;
	@Output() selfRemoved = new EventEmitter<void>();
	public members?: IMemberInfo[];
	private selfRemove?: boolean;

	constructor(
		private navService: TeamNavService,
		private navController: NavController,
		private userService: SneatUserService,
		private teamService: TeamService,
		@Inject(ErrorLogger) private errorLogger: IErrorLogger
	) {}

	public id = (_: number, m: IMemberInfo) => m.id;

	public goMember(member?: IMemberInfo): void {
		console.log('TeamPage.goMember()', member);
		if (!this.team) {
			this.errorLogger.logError(
				'Can not navigate to team member without team context'
			);
			return;
		}
		this.navService.navigateToMember(
			this.navController,
			this.team,
			member || {
				id: 'myself',
				title: 'Myself',
				roles: [MemberRoleEnum.contributor],
			}
		);
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.allMembers || changes.role) {
			this.members =
				this.role === null
					? this.allMembers
					: this.allMembers?.filter((m) =>
							m.roles?.some((r) => r === this.role)
					  );
		}
	}

	// public goAddMember(): void {
	// 	this.navService.navigateToAddMember(this.navController, this.team);
	// }

	public removeMember(event: Event, memberInfo: IMemberInfo) {
		// event.preventDefault();
		event.stopPropagation();
		if (!this.team) {
			return;
		}
		const members = this.team?.data?.members;
		const memberIndex = members?.findIndex((m) => m.id === memberInfo.id);
		if (members && this.team?.data?.members) {
			this.team.data.members = members.filter((m) => m.id !== memberInfo.id);
		}
		this.selfRemove = memberInfo.uid === this.userService.currentUserId;
		const teamId = this.team.id;
		this.teamService.removeTeamMember(this.team, memberInfo.id).subscribe({
			next: (team) => {
				if (teamId !== this.team?.id) {
					return;
				}
				this.team = { id: teamId, data: team };
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
