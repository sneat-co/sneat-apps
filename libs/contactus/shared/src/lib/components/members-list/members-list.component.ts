import {
	Component,
	computed,
	EventEmitter,
	inject,
	input,
	Input,
	Output,
	signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
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
	IonRouterOutlet,
	ModalController,
	NavController,
} from '@ionic/angular/standalone';
import { listAddRemoveAnimation, SpaceTypeFamily } from '@sneat/core';
import {
	ScheduleNavService,
	ScheduleNavServiceModule,
} from '@sneat/mod-schedulus-core';
import { WithSpaceInput } from '@sneat/space-services';
import { ContactService, ContactusNavService } from '@sneat/contactus-services';
import {
	IContactWithBrief,
	IContactWithBriefAndSpace,
} from '@sneat/contactus-core';
import { SpaceNavService } from '@sneat/space-services';
import { SneatUserService } from '@sneat/auth-core';
import { ClassName } from '@sneat/ui';
import { InviteModalComponent } from '../../modals/invite-modal';
import { ContactTitlePipe } from '../../pipes';
import { ContactRoleBadgesComponent } from '../contact-role-badges/contact-role-badges.component';
import { InlistAgeGroupComponent } from '../inlist-options/inlist-age-group.component';

@Component({
	selector: 'sneat-members-list',
	templateUrl: './members-list.component.html',
	animations: listAddRemoveAnimation,
	imports: [
		ScheduleNavServiceModule,
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
	providers: [{ provide: ClassName, useValue: 'MembersListComponent' }],
})
// TODO: Is it deprecated and should we migrated to Contacts list? Document reason if not.
export class MembersListComponent extends WithSpaceInput {
	private readonly navService = inject(SpaceNavService);
	private readonly navController = inject(NavController);
	private readonly userService = inject(SneatUserService);
	private readonly contactService = inject(ContactService);
	private readonly scheduleNavService = inject(ScheduleNavService);
	private readonly modalController = inject(ModalController);
	readonly routerOutlet = inject(IonRouterOutlet);

	private $selfRemove = signal(false);

	public readonly $members = input.required<readonly IContactWithBrief[]>();

	public $role = input<string>();

	@Output() readonly selfRemoved = new EventEmitter<void>();

	// TODO: document what is contactsByMember.
	@Input() public contactsByMember: Record<
		string,
		readonly IContactWithBriefAndSpace[]
	> = {};

	@Input() public hideRoles: readonly string[] = ['member'];

	// Holds filtered entries, use `allMembers` to pass input
	public readonly $membersToDisplay = computed<readonly IContactWithBrief[]>(
		() => {
			const role = this.$role();
			const members = this.$members();
			return role
				? members?.filter((m) => m.brief?.roles?.some((r) => r === role))
				: members;
		},
	);

	private readonly contactusNavService = inject(ContactusNavService);

	private readonly $isFamilySpace = computed(
		() => this.$spaceType() === SpaceTypeFamily,
	);

	protected isAgeOptionsVisible(contact: IContactWithBrief): boolean {
		// console.log('MembersListComponent.isAgeOptionsVisible()', member, teamDto);
		return (
			this.$isFamilySpace() &&
			contact.brief?.type === 'person' &&
			(!contact.brief?.ageGroup || contact.brief?.ageGroup === 'unknown')
		);
	}

	protected isInviteButtonVisible(contact: IContactWithBrief): boolean {
		return contact.brief?.type === 'person' && !contact.brief?.userID;
	}

	public genderIcon(m: IContactWithBrief) {
		switch (m.brief?.gender) {
			case 'male':
				return 'man-outline';
			case 'female':
				return 'woman-outline';
		}
		return 'person-outline';
	}

	public goMember(member?: IContactWithBrief): boolean {
		console.log('MembersListComponent.goMember()', member);
		if (!this.$space()) {
			this.errorLogger.logError(
				'Can not navigate to space member without space context',
			);
			return false;
		}
		if (!member?.id) {
			throw new Error('!member?.id');
		}
		this.contactusNavService.navigateToMember({
			...member,
			space: this.$space(),
		});
		return false;
	}

	public goSchedule(event: Event, contact: IContactWithBrief) {
		console.log('MembersListComponent.goSchedule()');
		event.stopPropagation();
		event.preventDefault();
		const space = this.$space();
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

	public removeMember(event: Event, member: IContactWithBrief) {
		// event.preventDefault();
		event.stopPropagation();
		const space = this.$space();
		if (!space) {
			return;
		}
		this.$selfRemove.set(
			member.brief?.userID === this.userService.currentUserID,
		);
		const spaceID = space.id;
		this.contactService
			.removeSpaceMember({ spaceID: spaceID, contactID: member.id })
			.subscribe({
				next: (space) => {
					if (spaceID !== space?.id) {
						return;
					}
					console.log('updated space:', space);
					if (this.$selfRemove()) {
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
					this.$selfRemove.set(false);
					this.errorLogger.logError(err, 'Failed to remove member from team');
				},
			});
	}

	protected async showInviteModal(
		event: Event,
		member: IContactWithBrief,
	): Promise<void> {
		console.log('showInviteModal()', event, member);
		event.stopPropagation();
		event.preventDefault();
		const modal = await this.modalController.create({
			component: InviteModalComponent,
			// swipeToClose: true,
			presentingElement: this.routerOutlet.nativeEl,
			componentProps: {
				space: this.$space(),
				member,
			},
		});
		await modal.present();
	}
}
