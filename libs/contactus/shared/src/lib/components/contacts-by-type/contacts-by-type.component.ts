import { group } from '@angular/animations';
import {
	Component,
	computed,
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
import { IonicModule } from '@ionic/angular';
import { eq, IIdAndBrief, IIdAndDbo, listItemAnimations } from '@sneat/core';
import {
	ContactRole,
	IContactBrief,
	IContactGroupDbo,
	IContactWithBrief,
	IContactWithCheck,
} from '@sneat/contactus-core';
import { ContactNavService } from '@sneat/contactus-services';
import { ISpaceContext } from '@sneat/space-models';
import { SneatBaseComponent } from '@sneat/ui';
import { Observable } from 'rxjs';
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
	imports: [IonicModule, ContactsListItemComponent],
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

	public readonly $contacts = input.required<readonly IContactWithCheck[]>();

	private readonly $selectedContactIDsByRole = signal<
		Readonly<Record<string, readonly string[]>>
	>({});

	protected readonly $otherContacts = signal<readonly IContactWithBrief[]>([]);
	protected readonly $contactGroups = signal<
		readonly IContactGroupWithContacts[]
	>([]);

	//
	@Input() filter = '';
	// @Input() contacts?: readonly IContactWithSpace[];
	@Input() goContact: (contact?: IContactWithBrief) => void = () => void 0;
	@Input() goMember: (id: string, event: Event) => boolean = () => false;

	@Input() command?: Observable<ContactsComponentCommand>;

	@Output()
	public readonly contactSelectionChange =
		new EventEmitter<IRoleContactCheckChangedArgs>();

	constructor(private readonly contactNavService: ContactNavService) {
		super('ContactsByTypeComponent');
		const effectRef = effect(() => {
			this.setContactGroups();
		});
		this.destroyed$.subscribe(() => {
			effectRef.destroy();
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
		const filter = this.filter;
		const contacts = this.$contacts();
		const selectedContactIDsByRole = this.$selectedContactIDsByRole();
		const noContactRoles = this.$space().dbo?.noContactRoles;
		let otherContacts = !filter
			? contacts
			: contacts &&
				contacts.filter((c) => c.brief?.title?.toLowerCase().includes(filter));

		const contactGroupDefinitions = this.$contactGroupDefinitions();

		contactGroupDefinitions.forEach((group) => {
			const rolesWithContacts: IContactRoleWithContacts[] = [];
			group.dbo?.roles?.forEach((role) => {
				const selectedContactIDs = selectedContactIDsByRole[role.id];
				const roleWithContacts: IContactRoleWithContacts = {
					...role,
					contacts: contacts
						.filter((c) => c.brief?.roles?.includes(role.id))
						.map((c) => ({
							...c,
							isChecked: selectedContactIDs?.includes(c.id),
						})),
				};
				if (filter && role.title.toLowerCase().includes(filter)) {
					rolesWithContacts.push(roleWithContacts); // Show all contacts in role that filtered by title
					return;
				}
				if (roleWithContacts.contacts) {
					roleWithContacts.contacts.forEach((c) => {
						otherContacts = otherContacts.filter((oc) => !eq(oc.id, c.id));
					});
					if (roleWithContacts.contacts.length && filter) {
						roleWithContacts.contacts = roleWithContacts.contacts.filter((c) =>
							c?.brief?.title?.toLowerCase().includes(filter),
						);
						if (roleWithContacts.contacts.length) {
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
				title: group.dbo?.title || '',
				roles: rolesWithContacts,
			};

			if (groupWithContacts.roles.length) {
				this.$contactGroups.update((v) => [...v, groupWithContacts]);
			}
		});
		if (otherContacts.length || this.$otherContacts().length) {
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

	protected addContact(event: Event, group: string, role?: ContactRole): void {
		event.stopPropagation();
		if (!this.$space().id) {
			return;
		}
		this.contactNavService.goNewContactPage(this.$space(), { group, role });
	}

	protected addSubGroup(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		alert('Not implemented yet');
	}

	// private readonly $checkedContactIDs = signal<readonly string[]>([]);

	protected checkChanged(args: ICheckChangedArgs, role: ContactRole): void {
		this.$selectedContactIDsByRole.update((v) => {
			const ids = v[role] || [];
			if (args.checked) {
				return { ...v, [role]: [...ids, args.id] };
			}
			return { ...v, [role]: ids.filter((id) => id !== args.id) };
		});
		this.contactSelectionChange.emit({ ...args, role });
	}

	public ngOnInit(): void {
		this.command?.pipe(this.takeUntilDestroyed()).subscribe((command) => {
			// console.log('ContactsByTypeComponent: command$ =>', command);
			switch (command) {
				case 'reset_selected': {
					this.$selectedContactIDsByRole.set({});
					this.setContactGroups();
					break;
				}
				case 'select_all': {
					throw new Error('Not implemented yet');
					break;
				}
			}
		});
	}
}
