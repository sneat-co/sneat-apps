import {
	Component,
	effect,
	EventEmitter,
	input,
	Input,
	OnChanges,
	OnInit,
	Output,
	signal,
	SimpleChanges,
} from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonItemGroup,
	IonItemSliding,
	IonLabel,
	IonSpinner,
} from '@ionic/angular/standalone';
import { eq, IIdAndDbo, listItemAnimations } from '@sneat/core';
import {
	ContactGroupWithIdAndBrief,
	ContactRole,
	IContactRoleWithIdAndBrief,
	IContactGroupDbo,
	IContactWithBrief,
	IContactWithCheck,
	isContactPassFilter,
} from '@sneat/contactus-core';
import { ContactNavService } from '@sneat/contactus-services';
import { ISpaceContext } from '@sneat/space-models';
import { SneatBaseComponent } from '@sneat/ui';
import { Observable } from 'rxjs';
import { IContactAddEventArgs } from '../contact-events';
import { ICheckChangedArgs } from '../contacts-checklist';
import { ContactsComponentCommand } from '../contacts-component.commands';
import { ContactsListItemComponent } from '../contacts-list';
import {
	IContactGroupWithContacts,
	IContactRoleWithContacts,
} from '../../ui-types';

export interface IRoleContactCheckChangedArgs extends ICheckChangedArgs {
	role: ContactRole;
}

@Component({
	imports: [
		ContactsListItemComponent,
		IonItemGroup,
		IonItem,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		IonItemSliding,
		IonItemDivider,
		IonSpinner,
	],
	selector: 'sneat-contacts-by-type',
	templateUrl: './contacts-by-type.component.html',
	animations: [listItemAnimations],
})
export class ContactsByTypeComponent
	extends SneatBaseComponent
	implements OnChanges, OnInit
{
	public readonly $space = input.required<ISpaceContext>();

	public readonly $contactGroupDefinitions =
		input.required<readonly IIdAndDbo<IContactGroupDbo>[]>();

	public readonly $contacts = input.required<
		readonly IContactWithCheck[] | undefined
	>();

	@Output() readonly contactsChange = new EventEmitter<IContactWithCheck[]>();

	protected readonly $otherContacts = signal<
		readonly IContactWithBrief[] | undefined
	>(undefined);
	protected readonly $contactGroups = signal<
		readonly IContactGroupWithContacts[]
	>([]);

	//
	public readonly $filter = input.required<string>();
	// @Input() contacts?: readonly IContactWithSpace[];
	@Input() contactClicked: (event: Event, contact: IContactWithBrief) => void =
		(event: Event, contact: IContactWithBrief) => {
			this.console.log(
				`ContactsByTypeComponent.contactClicked(contact{id=${contact.id}})`,
			);
			event.preventDefault();
			event.stopPropagation();
		};

	@Input() command?: Observable<ContactsComponentCommand>;

	@Output()
	public readonly contactSelectionChange =
		new EventEmitter<IRoleContactCheckChangedArgs>();

	@Input() goToNewContactPage = true;
	@Output() readonly addContactClick = new EventEmitter<IContactAddEventArgs>();

	constructor(private readonly contactNavService: ContactNavService) {
		super('ContactsByTypeComponent');
		effect(() => {
			this.setContactGroups();
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['contacts'] || changes['filter']) {
			this.setContactGroups();
		}
	}

	// hideRole(role: string): void {
	// 	if (!this.commune.id) {
	// 		throw new Error('!this.commune.id');
	// 	}
	// 	this.communeService.updateRecord(undefined, this.commune.id, dto => {
	// 		if (!dto.noContactRoles) {
	// 			dto = {...dto, noContactRoles: [role]};
	// 			return {dto, changed: true};
	// 		} else if (!dto.noContactRoles.includes(role)) {
	// 			dto.noContactRoles.push(role);
	// 			return {dto, changed: true};
	// 		}
	// 		return {dto, changed: false};
	// 	}).subscribe(dto => {
	// 		if (!dto) {
	// 			throw new Error(`commune not found by id: ${this.commune.id}`);
	// 		}
	// 		this.commune = new Commune(dto);
	// 		this.setContactGroups();
	// 	});
	// }

	private setContactGroups(): void {
		this.$contactGroups.set([]);
		const filter = this.$filter();
		const contacts = this.$contacts();
		const noContactRoles = this.$space().dbo?.noContactRoles;
		let otherContacts = !filter
			? contacts
			: contacts &&
				contacts.filter((c) => c.brief?.title?.toLowerCase().includes(filter));

		const contactGroupDefinitions = this.$contactGroupDefinitions();

		contactGroupDefinitions.forEach((group) => {
			const rolesWithContacts: IContactRoleWithContacts[] = [];
			group.dbo?.roles?.forEach((role) => {
				let roleWithContacts: IContactRoleWithContacts = {
					...role,
					// We do not filter by text here as we want to show all contacts if role title contains the text
					contacts: contacts?.filter((c) => c.brief?.roles?.includes(role.id)),
				};
				if (filter && role.brief.title.toLowerCase().includes(filter)) {
					// Show all contacts in role that filtered by title
					rolesWithContacts.push(roleWithContacts);
					return;
				}
				if (roleWithContacts.contacts) {
					roleWithContacts.contacts.forEach((c) => {
						otherContacts = otherContacts?.filter((oc) => !eq(oc.id, c.id));
					});
					if (roleWithContacts.contacts.length && filter) {
						roleWithContacts = {
							...roleWithContacts,
							contacts: roleWithContacts.contacts.filter((c) =>
								isContactPassFilter(c, filter, role.id),
							),
						};
						if (roleWithContacts.contacts?.length) {
							rolesWithContacts.push(roleWithContacts);
						}
					}
				}
				if (!filter && (!noContactRoles || !noContactRoles.includes(role.id))) {
					rolesWithContacts.push(roleWithContacts);
				}
			});

			const groupWithContacts: IContactGroupWithContacts = {
				...group.dbo,
				id: group.id,
				brief: {
					title: group.dbo?.title || '',
				},
				roles: rolesWithContacts,
			};

			if (groupWithContacts.roles.length) {
				this.$contactGroups.update((v) => [...v, groupWithContacts]);
			}
		});
		if (otherContacts?.length || this.$otherContacts()?.length) {
			this.$otherContacts.set(otherContacts);
		}
		// console.log(
		// 	'ContactsByTypeComponent.setContactGroups()',
		// 	this.$space(),
		// 	filter,
		// 	contacts,
		// 	selectedContactIDsByRole,
		// 	this.$contactGroups(),
		// 	this.$otherContacts(),
		// );
	}

	protected find(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		alert('Not implemented yet');
	}

	protected addContact(
		event: Event,
		group: ContactGroupWithIdAndBrief,
		role?: IContactRoleWithIdAndBrief,
	): void {
		event.stopPropagation();
		if (!this.goToNewContactPage) {
			this.addContactClick.emit({
				event,
				role: role,
				group: group,
			});
			return;
		}
		if (!this.$space().id) {
			return;
		}
		this.contactNavService.goNewContactPage(this.$space(), {
			group: group.id,
			role: role?.id,
		});
	}

	// private readonly $checkedContactIDs = signal<readonly string[]>([]);

	protected checkChanged(args: ICheckChangedArgs, role: ContactRole): void {
		this.contactsChange.emit(
			this.$contacts()?.map((c) =>
				c.id === args.id ? { ...c, isChecked: args.checked } : c,
			),
		);
		this.contactSelectionChange.emit({ ...args, role });
	}

	public ngOnInit(): void {
		this.command?.pipe(this.takeUntilDestroyed()).subscribe((command) => {
			// console.log('ContactsByTypeComponent: command$ =>', command);
			switch (command.name) {
				case 'reset_selected': {
					this.contactsChange.emit(
						this.$contacts()?.map((c) =>
							c.isChecked ? { ...c, isChecked: false } : c,
						),
					);
					this.setContactGroups();
					break;
				}
				case 'select_all': {
					throw new Error('Not implemented yet');
				}
			}
		});
	}
}
