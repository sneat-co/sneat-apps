import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { listAddRemoveAnimation } from '@sneat/animations';
import { IContact2Member } from '@sneat/dto';
import { ScheduleNavService } from '@sneat/extensions/schedulus/shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IMemberContext, ITeamContext } from '@sneat/team/models';
import { memberContextFromBrief, TeamNavService, TeamService } from '@sneat/team/services';
import { SneatUserService } from '@sneat/auth';
import { InviteModalComponent } from '../invite-modal/invite-modal.component';

@Component({
	selector: 'sneat-members-list',
	templateUrl: './members-list.component.html',
	styleUrls: ['./members-list.component.scss'],
	animations: listAddRemoveAnimation,
})
export class MembersListComponent implements OnChanges {

	private selfRemove?: boolean;
	private _members?: readonly IMemberContext[];
	@Input() public team: ITeamContext = { id: '' };
	@Input() public members?: readonly IMemberContext[];
	@Input() public role?: string;
	@Output() selfRemoved = new EventEmitter<void>();
	@Input() public contactsByMember: { [id: string]: IContact2Member[] } = {};
	// Holds filtered entries, use `allMembers` to pass input
	public membersToDisplay?: readonly IMemberContext[];

	constructor(
		private readonly navService: TeamNavService,
		private readonly navController: NavController,
		private readonly userService: SneatUserService,
		private readonly teamService: TeamService,
		private readonly scheduleNavService: ScheduleNavService,
		@Inject(ErrorLogger) private errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
		public readonly routerOutlet: IonRouterOutlet,
	) {
		//
	}

	public id = (_: number, m: { id: string }) => m.id;

	public genderIcon(m: IMemberContext) {
		switch (m.brief?.gender) {
			case 'male':
				return 'man-outline';
			case 'female':
				return 'woman-outline';
		}
		return 'person-outline';
	}

	public goMember(member?: IMemberContext): boolean {
		console.log('TeamPage.goMember()', member);
		if (!this.team) {
			this.errorLogger.logError(
				'Can not navigate to team member without team context',
			);
			return false;
		}
		if (!member?.id) {
			throw new Error('!member?.id');
		}
		if (!member.team) {
			member = { ...member, team: this.team };
		}
		this.navService.navigateToMember(this.navController, member);
		return false;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		console.log('MembersListComponent.ngOnChanges()', changes);
		if (changes['team'] || changes['members'] || changes['role']) {
			if (changes['members']) {
				this._members = this.members;
			} else if (changes['team'] && !this.members) {
				const team = this.team;
				this._members = this.team?.dto?.members?.map(m => memberContextFromBrief(m, team));
			}
			this.membersToDisplay = this.filterMembers(this._members);
		}
	}

	public goSchedule(event: Event, member: IMemberContext) {
		console.log('MembersListComponent.goSchedule()');
		event.stopPropagation();
		event.preventDefault();
		this.scheduleNavService.goSchedule(this.team, { member: member.id })
			.catch(this.errorLogger.logErrorHandler('failed to navigate to member\'s schedule page'));
	}

	public removeMember(event: Event, member: IMemberContext) {
		// event.preventDefault();
		event.stopPropagation();
		if (!this.team) {
			return;
		}
		const members = this.team?.dto?.members;
		const memberIndex = members?.findIndex((m) => m.id === member.id);
		if (members && this.team?.dto?.members) {
			this.team = {
				...this.team,
				dto: {
					...this.team.dto,
					members: members.filter((m) => m.id !== member.id),
				},
			};
		}
		this.selfRemove = member.brief?.userID === this.userService.currentUserId;
		const teamId = this.team.id;
		this.teamService.removeTeamMember(this.team, member.id).subscribe({
			next: (team) => {
				if (teamId !== this.team?.id) {
					return;
				}
				this.team = team;
				console.log('updated team:', team);
				if (this.selfRemove) {
					this.selfRemoved.emit();
				}
				if (
					!team ||
					(this.userService.currentUserId &&
						team?.dto?.userIDs?.indexOf(this.userService.currentUserId) || -1 < 0)
				) {
					this.navService.navigateToTeams('back');
				}
			},
			error: (err) => {
				this.selfRemove = undefined;
				this.errorLogger.logError(err, 'Failed to remove member from team');
				if (
					members &&
					((!members.find((m) => m.id === member.id) && memberIndex) ||
						memberIndex === 0)
				) {
					if (member.brief) {
						members.splice(memberIndex, 0, member.brief);
					}
				}
			},
		});
	}

	// public goAddMember(): void {
	// 	this.navService.navigateToAddMember(this.navController, this.team);
	// }

	private readonly filterMembers = (members?: readonly IMemberContext[]) => {
		return !this.role
			? members
			: members?.filter((m) =>
				m.brief?.roles?.some((r) => r === this.role),
			);
	};

	async showInviteModal(event: Event, member: IMemberContext): Promise<void> {
		console.log('showInviteModal()', event, member);
		event.stopPropagation();
		event.preventDefault();
		const modal = await this.modalController.create({
			component: InviteModalComponent,
			swipeToClose: true,
			presentingElement: this.routerOutlet.nativeEl,
			componentProps: {
				team: this.team,
				member,
			},
		});
		await modal.present();
	}
}
