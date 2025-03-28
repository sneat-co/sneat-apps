import {
	Component,
	input,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IIdAndBrief, IIdAndDbo, listItemAnimations } from '@sneat/core';
import { eq } from '@sneat/core';
import {
	ContactRole,
	IContactBrief,
	IContactGroupDbo,
} from '@sneat/contactus-core';
import { ContactNavService } from '@sneat/contactus-services';
import { ISpaceContext } from '@sneat/space-models';
import { ContactsListItemComponent } from '../contacts-list';
import {
	IContactGroupWithContacts,
	IContactRoleWithContacts,
} from '../../ui-types';

@Component({
	imports: [IonicModule, ContactsListItemComponent],
	selector: 'sneat-contacts-by-type',
	templateUrl: './contacts-by-type.component.html',
	animations: [listItemAnimations],
})
export class ContactsByTypeComponent implements OnChanges {
	protected otherContacts?: readonly IIdAndBrief<IContactBrief>[];
	protected contactGroups: readonly IContactGroupWithContacts[] = [];

	public readonly $contactGroupDefinitions =
		input.required<readonly IIdAndDbo<IContactGroupDbo>[]>();

	//
	@Input() filter = '';
	@Input({ required: true }) space?: ISpaceContext;
	@Input() contacts?: readonly IIdAndBrief<IContactBrief>[];
	@Input() goContact: (contact?: IIdAndBrief<IContactBrief>) => void = () =>
		void 0;
	@Input() goMember: (id: string, event: Event) => boolean = () => false;

	constructor(private readonly contactNavService: ContactNavService) {}

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
		this.contactGroups = [];
		const filter = this.filter;
		const contacts = this.contacts || [];
		console.log('setContactGroups()', this.space, filter, contacts);
		const noContactRoles = this.space?.dbo?.noContactRoles;
		let otherContacts = (this.otherContacts = !filter
			? contacts
			: contacts &&
				contacts.filter((c) => c.brief?.title?.toLowerCase().includes(filter)));

		const contactGroupDefinitions = this.$contactGroupDefinitions();

		contactGroupDefinitions.forEach((group) => {
			const rolesWithContacts: IContactRoleWithContacts[] = [];
			group.dbo?.roles?.forEach((role) => {
				const roleWithContacts: IContactRoleWithContacts = {
					...role,
					contacts: contacts.filter((c) => c.brief?.roles?.includes(role.id)),
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
				this.contactGroups = [...this.contactGroups, groupWithContacts];
			}
		});
		this.otherContacts = otherContacts;
	}

	public addContact(event: Event, group: string, role?: ContactRole): void {
		event.stopPropagation();
		if (!this.space) {
			return;
		}
		this.contactNavService.goNewContactPage(this.space, { group, role });
	}
}
