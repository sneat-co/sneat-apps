import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
	ContactsByTypeComponent,
	ContactsListItemComponent,
} from '@sneat/contactus-shared';
import { IIdAndBrief, listItemAnimations } from '@sneat/core';
import { ISelectItem } from '@sneat/ui';
import { FilterItemComponent } from '@sneat/components';
import { setHrefQueryParam } from '@sneat/core';
import {
	ContactRole,
	IContactBrief,
	IMemberGroupContext,
} from '@sneat/contactus-core';
import {
	SpaceComponentBaseParams,
	SpacePageTitleComponent,
	SpaceItemsBaseComponent,
} from '@sneat/space-components';
import {
	ContactusServicesModule,
	ContactusSpaceService,
} from '@sneat/contactus-services';
import { SpaceServiceModule } from '@sneat/space-services';
import { Subscription } from 'rxjs';
import { ContactsComponent } from './contacts.component';

@Component({
	selector: 'sneat-contacts-page',
	templateUrl: './contacts-page.component.html',
	providers: [SpaceComponentBaseParams],
	animations: [listItemAnimations],
	imports: [
		FormsModule,
		IonicModule,
		SpacePageTitleComponent,
		ContactusServicesModule,
		SpaceServiceModule,
		ContactsComponent,
		ContactsByTypeComponent,
		ContactsListItemComponent,
		FilterItemComponent,
	],
})
export class ContactsPageComponent extends SpaceItemsBaseComponent {
	public allContacts?: readonly IIdAndBrief<IContactBrief>[];
	public contactsByRole?: Record<string, readonly IIdAndBrief<IContactBrief>[]>;
	protected readonly $contacts = signal<
		readonly IIdAndBrief<IContactBrief>[] | undefined
	>(undefined);
	public groups: readonly IMemberGroupContext[] = [];
	public segment: 'list' | 'groups' = 'groups';
	// public readonly $filter = signal<string>('');
	public readonly $role = signal<ContactRole | undefined>(undefined);
	protected readonly $showTabs = computed(
		() => !this.$role() && this.space.type === 'family',
	);
	private contactsSubscription?: Subscription;

	readonly roles: readonly ISelectItem[] = [
		{ id: '', title: 'All', iconName: 'people-outline' },
		{ id: 'freight_agent', title: 'Agents', iconName: 'body-outline' },
		{ id: 'buyer', title: 'Buyers', iconName: 'cash-outline' },
		{ id: 'dispatcher', title: 'Dispatchers', iconName: 'business-outline' },
		{ id: 'trucker', title: 'Truckers', iconName: 'bus-outline' },
		{ id: 'shipping_line', title: 'Shipping lines', iconName: 'boat-outline' },
	];

	protected $pageTitle = computed(() => {
		const role = this.$role();
		if (role) {
			return `${role.toUpperCase() + role.substr(1)}s`;
		}
		return 'Contacts';
	});

	constructor(
		// private readonly contactService: ContactService,
		private readonly contactusSpaceService: ContactusSpaceService,
	) {
		super('ContactsPageComponent', '');
		const role = location.pathname.match(/(applicant|landlord|tenant)/);
		if (role) {
			this.$role.set(role[1] as ContactRole);
		}
		this.allContacts = window.history.state
			.contacts as IIdAndBrief<IContactBrief>[];

		if (this.allContacts) {
			this.$filter.set('');
			this.applyFilter();
		}
		// this.spaceIDChanged$.subscribe({
		// 	next: this.onSpaceIDChangedWorker,
		// });
		this.route.queryParamMap.pipe(this.takeUntilDestroyed()).subscribe({
			next: (q) => {
				this.$role.set((q.get('role') as ContactRole) || undefined);
				this.applyFilter();
			},
		});
		// this.spaceDtoChanged$.subscribe({
		// 	next: this.onSpaceDtoChanged,
		// })
	}

	protected override onSpaceIdChanged() {
		super.onSpaceIdChanged();
		this.contactsSubscription?.unsubscribe();
		if (this.contactsSubscription) {
			this.contactsSubscription.unsubscribe();
		}
		if (!this.space) {
			return;
		}

		this.contactusSpaceService.watchContactBriefs(this.space.id).subscribe({
			next: (contacts) => {
				this.setSpaceContacts(contacts || []);
				this.applyFilter();
			},
		});
	}

	public contactsNumber(role: string): number {
		const roleContacts =
			(this.contactsByRole && this.contactsByRole[role]) ?? [];
		return roleContacts?.length ?? 0;
	}

	protected $titleIcon = computed(() => {
		switch (this.$role()) {
			case 'tenant':
				return '🤠';
			case 'landlord':
				return '🤴';
			case 'applicant':
				return '🤔';
			default:
				return '📇';
		}
	});

	protected $canAdd = computed<boolean>(() => {
		const role = this.$role();
		return role !== 'tenant' && role !== 'landlord';
	});

	protected applyFilter(filter?: string): void {
		if (filter || filter === '') {
			this.$filter.set(filter);
			filter = filter.toLowerCase();
		} else {
			filter = this.$filter().toLowerCase();
		}
		const role = this.$role();
		const contacts =
			!filter && !role
				? this.allContacts
				: this.allContacts?.filter(
						(c) =>
							(!filter ||
								c.brief?.title?.toLowerCase().includes(filter) ||
								c.brief?.names?.firstName?.toLowerCase().includes(filter) ||
								c.brief?.names?.lastName?.toLowerCase().includes(filter) ||
								c.brief?.names?.nickName?.toLowerCase().includes(filter) ||
								c.brief?.names?.middleName?.toLowerCase().includes(filter) ||
								c.brief?.names?.fullName?.toLowerCase().includes(filter)) &&
							(!role || (c.brief?.roles && c?.brief.roles.includes(role))),
					);
		console.log(
			'ContactsPageComponent.applyFilter()',
			filter,
			role,
			'allContacts:',
			this.allContacts,
			'contactsToShow:',
			contacts,
		);
		this.$contacts.set(contacts);
	}

	protected readonly goContact = (
		contact?: IIdAndBrief<IContactBrief>,
	): void => {
		if (!contact) {
			this.errorLogger.logError('no contact');
			return;
		}
		if (!this.space) {
			this.errorLogger.logError('no team');
			return;
		}
		this.spaceParams.spaceNavService
			.navigateForwardToSpacePage(this.space, `contact/${contact.id}`, {
				state: { contact },
			})
			.catch(
				this.errorLogger.logErrorHandler('failed to navigate to contact page'),
			);
	};

	protected readonly goNewContact = (): void => {
		if (!this.space) {
			return;
		}
		let navResult: Promise<boolean>;

		if (this.space.type === 'family') {
			navResult = this.spaceParams.spaceNavService.navigateForwardToSpacePage(
				this.space,
				'new-contact',
			);
		} else {
			navResult = this.spaceParams.spaceNavService.navigateForwardToSpacePage(
				this.space,
				'new-company',
				{ queryParams: this.$role ? { role: this.$role } : undefined },
			);
		}

		navResult.catch(
			this.errorLogger.logErrorHandler(
				'failed to navigate to contact creation page',
			),
		);
	};

	protected goMember(id: string, event: Event): boolean {
		event.stopPropagation();
		if (!this.space) {
			return false;
		}
		this.spaceParams.spaceNavService
			.navigateForwardToSpacePage(this.space, `member/${id}`, {
				state: {
					member: { id },
				},
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'failed to navigate to contact creation page',
				),
			);
		return false;
	}

	protected goGroup(group: IMemberGroupContext): void {
		if (!this.space) {
			return;
		}
		this.spaceParams.spaceNavService
			.navigateForwardToSpacePage(this.space, `group/${group.id}`, {
				state: {
					group: group,
				},
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'failed to navigate to contact creation page',
				),
			);
	}

	private readonly setSpaceContacts = (
		contacts: IIdAndBrief<IContactBrief>[],
	): void => {
		console.log('ContactsPageComponent.setSpaceContacts()', contacts);
		this.allContacts = contacts;
		const contactsByRole: Record<string, IIdAndBrief<IContactBrief>[]> = {
			'': [],
		};
		contacts.forEach((c) => {
			contactsByRole[''].push(c);
			c.brief?.roles?.forEach((role) => {
				const roleContacts = contactsByRole[role as ContactRole];
				if (roleContacts) {
					roleContacts.push(c);
				} else {
					contactsByRole[role] = [c];
				}
			});
		});
		this.contactsByRole = contactsByRole;
		this.applyFilter();
	};

	protected onRoleChanged(event: CustomEvent): void {
		event.stopPropagation();
		this.$role.set(event.detail.value);
		const url = setHrefQueryParam('role', this.$role() || '');
		history.replaceState(undefined, document.title, url);
		this.applyFilter();
	}

	// roleSegmentButtonClicked(event: Event): void {
	// 	console.log('roleSegmentButtonClicked', event);
	// 	event.stopPropagation();
	// 	event.preventDefault();
	// 	const ce = event as CustomEvent;
	// 	if (ce.detail.value === this.role) {
	// 		this.role = undefined;
	// 	}
	// }
}
