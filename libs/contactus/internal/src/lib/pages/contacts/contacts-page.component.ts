import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
	ContactsByTypeComponent,
	ContactsListComponent,
	ContactsListItemComponent,
} from '@sneat/contactus-shared';
import { IIdAndBrief, listItemAnimations } from '@sneat/core';
import { FilterItemComponent, ISelectItem } from '@sneat/components';
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

@Component({
	selector: 'sneat-contacts-page',
	templateUrl: './contacts-page.component.html',
	providers: [SpaceComponentBaseParams],
	animations: [listItemAnimations],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SpacePageTitleComponent,
		FilterItemComponent,
		ContactsByTypeComponent,
		ContactusServicesModule,
		SpaceServiceModule,
		ContactsListItemComponent,
	],
})
export class ContactsPageComponent extends SpaceItemsBaseComponent {
	public allContacts?: IIdAndBrief<IContactBrief>[];
	public contactsByRole?: Record<string, IIdAndBrief<IContactBrief>[]>;
	public contacts?: IIdAndBrief<IContactBrief>[];
	public groups: IMemberGroupContext[] = [];
	public segment: 'list' | 'groups' = 'groups';
	public filter = '';
	public role?: ContactRole;
	private contactsSubscription?: Subscription;

	readonly roles: ISelectItem[] = [
		{ id: '', title: 'All', iconName: 'people-outline' },
		{ id: 'freight_agent', title: 'Agents', iconName: 'body-outline' },
		{ id: 'buyer', title: 'Buyers', iconName: 'cash-outline' },
		{ id: 'dispatcher', title: 'Dispatchers', iconName: 'business-outline' },
		{ id: 'trucker', title: 'Truckers', iconName: 'bus-outline' },
		{ id: 'shipping_line', title: 'Shipping lines', iconName: 'boat-outline' },
	];

	public contactsNumber(role: string): number {
		const roleContacts =
			(this.contactsByRole && this.contactsByRole[role]) ?? [];
		return roleContacts?.length ?? 0;
	}

	constructor(
		// private readonly contactService: ContactService,
		private readonly contactusSpaceService: ContactusSpaceService,
	) {
		super('ContactsPageComponent', '');
		const role = location.pathname.match(/(applicant|landlord|tenant)/);
		if (role) {
			this.role = role[1] as ContactRole;
		}
		this.allContacts = window.history.state
			.contacts as IIdAndBrief<IContactBrief>[];

		if (this.allContacts) {
			this.applyFilter('', this.role);
		}
		// this.teamIDChanged$.subscribe({
		// 	next: this.onTeamIDChangedWorker,
		// });
		this.route.queryParamMap.pipe(this.takeUntilDestroyed()).subscribe({
			next: (q) => {
				this.role = (q.get('role') as ContactRole) || undefined;
				this.applyFilter(this.filter, this.role);
			},
		});
		// this.teamDtoChanged$.subscribe({
		// 	next: this.onTeamDtoChanged,
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
				this.applyFilter(this.filter, this.role);
			},
		});
	}

	get pageTitle(): string {
		if (this.role) {
			return `${this.role[0].toUpperCase() + this.role.substr(1)}s`;
		}
		return 'Contacts';
	}

	get titleIcon(): string {
		switch (this.role) {
			case 'tenant':
				return '🤠';
			case 'landlord':
				return '🤴';
			case 'applicant':
				return '🤔';
			default:
				return '📇';
		}
	}

	get canAdd(): boolean {
		const { role } = this;
		return role !== 'tenant' && role !== 'landlord';
	}

	applyFilter(filter: string, role?: ContactRole): void {
		console.log(
			'ContactsPageComponent.applyFilter()',
			filter,
			role,
			this.allContacts,
		);
		filter = filter && filter.toLowerCase();
		this.filter = filter;
		this.contacts =
			!filter && !role
				? this.allContacts
				: this.allContacts?.filter(
						(c) =>
							(!filter || c.brief?.title?.toLowerCase().includes(filter)) &&
							(!role || (c.brief?.roles && c?.brief.roles.includes(role))),
					);
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
				{ queryParams: this.role ? { role: this.role } : undefined },
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
		this.applyFilter(this.filter, this.role);
	};

	protected onRoleChanged(event: Event): void {
		event.stopPropagation();
		const url = setHrefQueryParam('role', this.role || '');
		history.replaceState(undefined, document.title, url);
		this.applyFilter(this.filter, this.role);
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
