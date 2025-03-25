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
import {
	IonAvatar,
	IonButton,
	IonButtons,
	IonIcon,
	IonImg,
	IonItem,
	IonItemOption,
	IonItemOptions,
	IonItemSliding,
	IonLabel,
	IonSkeletonText,
} from '@ionic/angular/standalone';
import { ContactTitlePipe } from '@sneat/components';
import { IIdAndBrief, listAddRemoveAnimation } from '@sneat/core';
import { IContactBrief } from '@sneat/contactus-core';
import {
	ScheduleNavService,
	ScheduleNavServiceModule,
} from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	InviteModalComponent,
	InviteModalModule,
} from '@sneat/space-components';
import { ContactService } from '@sneat/contactus-services';
import { IContactusSpaceDboAndID } from '@sneat/contactus-core';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceNavService } from '@sneat/space-services';
import { SneatUserService } from '@sneat/auth-core';
import { ContactRoleBadgesComponent } from '../contact-role-badges/contact-role-badges.component';
import { InlistAgeGroupComponent } from '../inlist-options/inlist-age-group.component';

@Component({
	selector: 'sneat-members-list',
	templateUrl: './members-list.component.html',
	animations: listAddRemoveAnimation,
	imports: [
		CommonModule,
		FormsModule,
		ScheduleNavServiceModule,

		InviteModalModule,
		RouterModule,
		ContactRoleBadgesComponent,
		InlistAgeGroupComponent,
		IonItem,
		IonAvatar,
		IonImg,
		IonSkeletonText,
		IonItemSliding,
		IonLabel,
		IonIcon,
		IonButtons,
		IonButton,
		IonItemOptions,
		IonItemOption,
		ContactTitlePipe,
	],
})
// TODO: Is it deprecated and should we migrated to Contacts list?
export class MembersListComponent implements OnChanges {
	private selfRemove?: boolean;

	@Input({ required: true }) public space?: ISpaceContext;

	@Input({ required: true })
	public members?: readonly IIdAndBrief<IContactBrief>[];

	@Input() public role?: string;

	@Output() selfRemoved = new EventEmitter<void>();
	@Input() public contactsByMember: Record<
		string,
		readonly IIdAndBrief<IContactBrief>[]
	> = {};

	@Input() public hideRoles: readonly string[] = ['member'];

	// Holds filtered entries, use `allMembers` to pass input
	public membersToDisplay?: readonly IIdAndBrief<IContactBrief>[];

	protected contactusSpace?: IContactusSpaceDboAndID;

	constructor(
		private readonly navService: SpaceNavService,
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

	protected isAgeOptionsVisible(member: IIdAndBrief<IContactBrief>): boolean {
		const spaceDbo = this.space?.dbo;
		// console.log('MembersListComponent.isAgeOptionsVisible()', member, teamDto);
		return (
			spaceDbo?.type === 'family' &&
			member.brief?.type === 'person' &&
			(!member.brief?.ageGroup || member.brief?.ageGroup === 'unknown')
		);
	}

	protected isInviteButtonVisible(member: IIdAndBrief<IContactBrief>): boolean {
		return member.brief?.type === 'person' && !member.brief?.userID;
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
		console.log('MembersListComponent.goMember()', member);
		if (!this.space) {
			this.errorLogger.logError(
				'Can not navigate to space member without space context',
			);
			return false;
		}
		if (!member?.id) {
			throw new Error('!member?.id');
		}
		this.navService.navigateToMember(this.navController, {
			...member,
			space: this.space,
		});
		return false;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['members'] || changes['role']) {
			this.membersToDisplay = this.filterMembers(this.members);
			console.log(
				'MembersListComponent.ngOnChanges(): members or role changed:',
				'role:',
				this.role,
				'members:',
				this.members,
				'membersToDisplay:',
				this.membersToDisplay,
			);
			console.log(
				'MembersListComponent.ngOnChanges(): membersToDisplay:',
				this.membersToDisplay,
			);
		} else if (Object.keys(changes).length) {
			console.log('MembersListComponent.ngOnChanges()', changes);
		}
	}

	public goSchedule(event: Event, contact: IIdAndBrief<IContactBrief>) {
		console.log('MembersListComponent.goSchedule()');
		event.stopPropagation();
		event.preventDefault();
		const space = this.space;
		if (space) {
			this.scheduleNavService
				.goCalendar(space, { member: contact.id })
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
		if (!this.space) {
			return;
		}
		this.selfRemove = member.brief?.userID === this.userService.currentUserID;
		const spaceID = this.space.id;
		this.contactService
			.removeSpaceMember({ spaceID: spaceID, contactID: member.id })
			.subscribe({
				next: (space) => {
					if (spaceID !== this.space?.id) {
						return;
					}
					this.space = space;
					console.log('updated space:', space);
					if (this.selfRemove) {
						this.selfRemoved.emit();
					}
					if (
						!space ||
						(this.userService.currentUserID &&
							space?.dbo?.userIDs?.indexOf(this.userService.currentUserID)) ||
						-1 < 0
					) {
						this.navService.navigateToSpaces('back');
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
				space: this.space,
				member,
			},
		});
		await modal.present();
	}
}
