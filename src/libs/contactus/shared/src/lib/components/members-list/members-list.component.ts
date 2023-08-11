import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { listAddRemoveAnimation } from '@sneat/core';
import { IContactBrief } from '@sneat/dto';
import { ScheduleNavService } from '@sneat/extensions/schedulus/shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { InviteModalComponent } from '@sneat/team/components';
import { ContactService } from '@sneat/contactus-services';
import { IBriefAndID, IContactContext, IContactusTeamDtoWithID, ITeamContext } from '@sneat/team/models';
import { TeamNavService } from '@sneat/team/services';
import { SneatUserService } from '@sneat/auth-core';

@Component({
	selector: 'sneat-members-list',
	templateUrl: './members-list.component.html',
	styleUrls: ['./members-list.component.scss'],
	animations: listAddRemoveAnimation,
})
// Deprecated: TODO migrated to Contacts list?
export class MembersListComponent implements OnChanges {

	private selfRemove?: boolean;
	@Input() public team?: ITeamContext;
	@Input() public members?: readonly IContactContext[];
	@Input() public role?: string;
	@Output() selfRemoved = new EventEmitter<void>();
	@Input() public contactsByMember: { [id: string]: readonly IBriefAndID<IContactBrief>[] } = {};
	// Holds filtered entries, use `allMembers` to pass input
	public membersToDisplay?: readonly IContactContext[];

	protected contactusTeam?: IContactusTeamDtoWithID;

	constructor(
		private readonly navService: TeamNavService,
		private readonly navController: NavController,
		private readonly userService: SneatUserService,
		private readonly contactService: ContactService,
		private readonly scheduleNavService: ScheduleNavService,
		@Inject(ErrorLogger) private errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
		public readonly routerOutlet: IonRouterOutlet,
	) {
		//
	}

	protected readonly id = (_: number, o: { id: string }) => o.id;

	public genderIcon(m: IContactContext) {
		switch (m.brief?.gender) {
			case 'male':
				return 'man-outline';
			case 'female':
				return 'woman-outline';
		}
		return 'person-outline';
	}

	public goMember(member?: IContactContext): boolean {
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
		if (changes['members'] || changes['role']) {
			console.log('MembersListComponent.ngOnChanges(): members or role changed:', this.role, this.members);
			this.membersToDisplay = this.filterMembers(this.members);
			console.log('MembersListComponent.ngOnChanges(): membersToDisplay:', this.membersToDisplay);
		}
	}

	public goSchedule(event: Event, contact: IContactContext) {
		console.log('MembersListComponent.goSchedule()');
		event.stopPropagation();
		event.preventDefault();
		const team = this.team;
		if (team) {
			this.scheduleNavService.goSchedule(team, { member: contact.id })
				.catch(this.errorLogger.logErrorHandler('failed to navigate to member\'s schedule page'));
		}
	}

	public removeMember(event: Event, member: IContactContext) {
		// event.preventDefault();
		event.stopPropagation();
		if (!this.team) {
			return;
		}
		this.selfRemove = member.brief?.userID === this.userService.currentUserID;
		const teamID = this.team.id;
		this.contactService.removeTeamMember(teamID, member.id).subscribe({
			next: (team) => {
				if (teamID !== this.team?.id) {
					return;
				}
				this.team = team;
				console.log('updated team:', team);
				if (this.selfRemove) {
					this.selfRemoved.emit();
				}
				if (
					!team ||
					(this.userService.currentUserID &&
						team?.dto?.userIDs?.indexOf(this.userService.currentUserID) || -1 < 0)
				) {
					this.navService.navigateToTeams('back');
				}
			},
			error: (err: unknown) => {
				this.selfRemove = undefined;
				this.errorLogger.logError(err, 'Failed to remove member from team');
			},
		});
	}

	// public goAddMember(): void {
	// 	this.navService.navigateToAddMember(this.navController, this.team);
	// }

	private readonly filterMembers = (members?: readonly IContactContext[]): readonly IContactContext[] | undefined => {
		return !this.role
			? members
			: members?.filter((m) =>
				m.brief?.roles?.some((r) => r === this.role),
			);
	};

	async showInviteModal(event: Event, member: IContactContext): Promise<void> {
		console.log('showInviteModal()', event, member);
		event.stopPropagation();
		event.preventDefault();
		const modal = await this.modalController.create({
			component: InviteModalComponent,
			// swipeToClose: true,
			presentingElement: this.routerOutlet.nativeEl,
			componentProps: {
				team: this.team,
				member,
			},
		});
		await modal.present();
	}
}
