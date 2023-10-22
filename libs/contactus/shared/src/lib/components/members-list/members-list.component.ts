import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
	IonicModule,
	IonRouterOutlet,
	ModalController,
	NavController,
} from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { listAddRemoveAnimation } from '@sneat/core';
import { AgeGroupID, IContactBrief, IIdAndBrief } from '@sneat/dto';
import {
	ScheduleNavService,
	ScheduleNavServiceModule,
} from '@sneat/extensions/schedulus/shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	InviteModalComponent,
	InviteModalModule,
} from '@sneat/team/components';
import {
	ContactService,
	IUpdateContactRequest,
} from '@sneat/contactus-services';
import { IContactusTeamDtoAndID, ITeamContext } from '@sneat/team/models';
import { TeamNavService } from '@sneat/team/services';
import { SneatUserService } from '@sneat/auth-core';
import { ContactRoleBadgesComponent } from '../contact-role-badges/contact-role-badges.component';

@Component({
	selector: 'sneat-members-list',
	templateUrl: './members-list.component.html',
	animations: listAddRemoveAnimation,
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ScheduleNavServiceModule,
		SneatPipesModule,
		InviteModalModule,
		RouterModule,
		ContactRoleBadgesComponent,
	],
})
// TODO: Is it deprecated and should we migrated to Contacts list?
export class MembersListComponent implements OnChanges {
	private selfRemove?: boolean;
	@Input() public team?: ITeamContext;
	@Input() public members?: readonly IIdAndBrief<IContactBrief>[];
	@Input() public role?: string;
	@Output() selfRemoved = new EventEmitter<void>();
	@Input() public contactsByMember: {
		[id: string]: readonly IIdAndBrief<IContactBrief>[];
	} = {};

	@Input() public hideRoles: readonly string[] = ['member'];

	// Holds filtered entries, use `allMembers` to pass input
	public membersToDisplay?: readonly IIdAndBrief<IContactBrief>[];

	protected contactusTeam?: IContactusTeamDtoAndID;

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

	protected readonly memberID = (_: number, o: IIdAndBrief<IContactBrief>) =>
		o.id;

	protected isAgeOptionsVisible(member: IIdAndBrief<IContactBrief>): boolean {
		const teamDto = this.team?.dto;
		return (
			teamDto?.type === 'family' &&
			member.brief?.type === 'person' &&
			(!member.brief?.ageGroup || member.brief?.ageGroup === 'unknown')
		);
	}

	protected isInviteButtonVisible(member: IIdAndBrief<IContactBrief>): boolean {
		return member.brief.type === 'person' && !member.brief.userID;
	}

	protected setAgeGroup(
		event: Event,
		member: IIdAndBrief<IContactBrief>,
		ageGroup: AgeGroupID,
	): void {
		console.log('MembersListComponent.setAgeGroup()', member, ageGroup);
		event.preventDefault();
		event.stopPropagation();
		const teamID = this.team?.id;
		if (!teamID) {
			return;
		}
		const request: IUpdateContactRequest = {
			teamID,
			contactID: member.id,
			ageGroup,
		};
		this.contactService.updateContact(request).subscribe({
			next: () => console.log('age group updated'),
			error: this.errorLogger.logErrorHandler(
				'failed to update contact with age group',
			),
		});
	}

	public genderIcon(m: IIdAndBrief<IContactBrief>) {
		switch (m.brief?.gender) {
			case 'male':
				return 'man-outline';
			case 'female':
				return 'woman-outline';
		}
		return 'person-outline';
	}

	public goMember(member?: IIdAndBrief<IContactBrief>): boolean {
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
		this.navService.navigateToMember(this.navController, {
			...member,
			team: this.team,
		});
		return false;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		console.log('MembersListComponent.ngOnChanges()', changes);
		if (changes['members'] || changes['role']) {
			console.log(
				'MembersListComponent.ngOnChanges(): members or role changed:',
				this.role,
				this.members,
			);
			this.membersToDisplay = this.filterMembers(this.members);
			console.log(
				'MembersListComponent.ngOnChanges(): membersToDisplay:',
				this.membersToDisplay,
			);
		}
	}

	public goSchedule(event: Event, contact: IIdAndBrief<IContactBrief>) {
		console.log('MembersListComponent.goSchedule()');
		event.stopPropagation();
		event.preventDefault();
		const team = this.team;
		if (team) {
			this.scheduleNavService
				.goSchedule(team, { member: contact.id })
				.catch(
					this.errorLogger.logErrorHandler(
						"failed to navigate to member's schedule page",
					),
				);
		}
	}

	public removeMember(event: Event, member: IIdAndBrief<IContactBrief>) {
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
						team?.dto?.userIDs?.indexOf(this.userService.currentUserID)) ||
					-1 < 0
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

	private readonly filterMembers = (
		members?: readonly IIdAndBrief<IContactBrief>[],
	): readonly IIdAndBrief<IContactBrief>[] | undefined => {
		return !this.role
			? members
			: members?.filter((m) => m.brief?.roles?.some((r) => r === this.role));
	};

	async showInviteModal(
		event: Event,
		member: IIdAndBrief<IContactBrief>,
	): Promise<void> {
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
