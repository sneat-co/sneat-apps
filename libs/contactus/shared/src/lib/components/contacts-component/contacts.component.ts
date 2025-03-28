import {
	ChangeDetectionStrategy,
	Component,
	computed,
	EventEmitter,
	inject,
	Input,
	input,
	OnInit,
	Output,
	signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FilterItemComponent } from '@sneat/components';
import {
	ContactRole,
	IContactBrief,
	IContactWithCheck,
	IMemberGroupContext,
} from '@sneat/contactus-core';
import { defaultFamilyContactGroups } from '@sneat/contactus-services';
import { IIdAndBrief, listItemAnimations } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceNavService } from '@sneat/space-services';
import { ISelectItem, SneatBaseComponent } from '@sneat/ui';
import { Observable } from 'rxjs';
import {
	ContactsByTypeComponent,
	ContactsListItemComponent,
	ICheckChangedArgs,
} from '../';
import { ContactsComponentCommand } from '../contacts-component.commands';

@Component({
	selector: 'sneat-contacts',
	templateUrl: './contacts.component.html',
	imports: [
		IonicModule,
		FormsModule,
		ContactsByTypeComponent,
		ContactsListItemComponent,
		FilterItemComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [listItemAnimations],
})
export class ContactsComponent extends SneatBaseComponent implements OnInit {
	public readonly $space = input.required<ISpaceContext>();

	public readonly $role = input<undefined | ContactRole>();

	@Input() command?: Observable<ContactsComponentCommand>;

	@Output() readonly roleChange = new EventEmitter<undefined | ContactRole>();

	@Output() public readonly selectedContactsChange = new EventEmitter<
		readonly IIdAndBrief<IContactBrief>[]
	>();

	protected readonly $showTabs = computed(
		() => !this.$role() && this.$space().type === 'family',
	);

	constructor() {
		super('ContactsComponent');
	}

	protected readonly $filter = signal<string>('');

	protected onFilterChanged(filter: string): void {
		this.$filter.set(filter);
	}

	private readonly spaceNavService = inject(SpaceNavService);

	public readonly $allContacts = input.required<
		readonly IIdAndBrief<IContactBrief>[] | undefined
	>();

	protected readonly familyGroupDefinitions = defaultFamilyContactGroups;

	public segment: 'list' | 'groups' = 'groups';

	public groups: readonly IMemberGroupContext[] = [];

	ngOnInit() {
		console.log('ContactsComponent.ngOnInit()');
		this.command?.pipe(this.takeUntilDestroyed()).subscribe((command) => {
			console.log('ContactsComponent.ngOnInit() command=' + command);
			switch (command) {
				case 'reset_selected':
					this.$selectedContactIDs.set([]);
					this.selectedContactsChange.emit(this.$selectedContacts());
					break;
				case 'select_all':
					break;
			}
		});
	}

	private $contactsByRole = computed<
		Record<string, readonly IContactWithCheck[]>
	>(() => {
		console.log('$contactsByRole - started');
		const contacts = this.$allContacts() || [];
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
		console.log('$contactsByRole complete:', contacts, contactsByRole);
		return contactsByRole;
	});

	readonly roles: readonly ISelectItem[] = [
		{ id: '', title: 'All', iconName: 'people-outline' },
		{ id: 'freight_agent', title: 'Agents', iconName: 'body-outline' },
		{ id: 'buyer', title: 'Buyers', iconName: 'cash-outline' },
		{ id: 'dispatcher', title: 'Dispatchers', iconName: 'business-outline' },
		{ id: 'trucker', title: 'Truckers', iconName: 'bus-outline' },
		{ id: 'shipping_line', title: 'Shipping lines', iconName: 'boat-outline' },
	];

	protected $canAdd = computed<boolean>(() => {
		const role = this.$role();
		return role !== 'tenant' && role !== 'landlord';
	});

	public contactsNumber(role: string): number {
		const contactsByRole = this.$contactsByRole();
		const roleContacts = (contactsByRole && contactsByRole[role]) ?? [];
		return roleContacts?.length ?? 0;
	}

	protected $contacts = computed(() => {
		const allContacts = this.$allContacts(),
			role = this.$role();

		const filter = this.$filter().trim().toLowerCase();

		console.log('$contacts - started', allContacts?.length);

		return !filter && !role
			? allContacts
			: allContacts?.filter(
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
	});

	protected readonly goContact = (
		contact?: IIdAndBrief<IContactBrief>,
	): void => {
		if (!contact) {
			this.errorLogger.logError('no contact');
			return;
		}
		const space = this.$space();
		if (!space) {
			this.errorLogger.logError('no team');
			return;
		}
		this.spaceNavService
			.navigateForwardToSpacePage(space, `contact/${contact.id}`, {
				state: { contact },
			})
			.catch(
				this.errorLogger.logErrorHandler('failed to navigate to contact page'),
			);
	};

	protected readonly goNewContact = (): void => {
		const space = this.$space();
		if (!space.id && !space.type) {
			return;
		}
		let navResult: Promise<boolean>;

		if (space.type === 'family') {
			navResult = this.spaceNavService.navigateForwardToSpacePage(
				space,
				'new-contact',
			);
		} else {
			navResult = this.spaceNavService.navigateForwardToSpacePage(
				space,
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

	private readonly $selectedContactIDs = signal<readonly string[]>([]);

	private readonly $selectedContacts = computed<
		readonly IIdAndBrief<IContactBrief>[]
	>(() => {
		const contacts = this.$contacts();
		const selectedContactIDs = this.$selectedContactIDs();
		return contacts?.filter((c) => selectedContactIDs.includes(c.id)) || [];
	});

	protected contactSelectionChanged(args: ICheckChangedArgs) {
		this.$selectedContactIDs.update((v) => {
			if (args.checked) {
				return [...v, args.id];
			}
			return v.filter((id) => id !== args.id);
		});
		this.selectedContactsChange.emit(this.$selectedContacts());
	}

	protected goMember(id: string, event: Event): boolean {
		event.stopPropagation();
		const space = this.$space();
		this.spaceNavService
			.navigateForwardToSpacePage(space, `member/${id}`, {
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
		const space = this.$space();
		this.spaceNavService
			.navigateForwardToSpacePage(space, `group/${group.id}`, {
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

	protected onRoleChanged(event: CustomEvent): void {
		event.stopPropagation();
		this.roleChange.emit(event.detail.value);
	}

	protected addGroup(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		alert('Not implemented yet');
	}
}
