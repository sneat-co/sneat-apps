import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IIdAndBrief, listItemAnimations } from '@sneat/core';
import {
	ContactsListModule,
	IContactGroupWithContacts,
	IContactRoleWithContacts,
} from '../..';
import { eq } from '@sneat/core';
import { ContactRole, IContactBrief } from '@sneat/contactus-core';
import {
	ContactNavService,
	defaultFamilyContactGroups,
} from '@sneat/contactus-services';
import { ITeamContext } from '@sneat/team-models';

@Component({
	standalone: true,
	imports: [CommonModule, IonicModule, ContactsListModule],
	selector: 'sneat-contacts-family',
	templateUrl: './contacts-by-type.component.html',
	animations: [listItemAnimations],
})
export class ContactsByTypeComponent implements OnChanges {
	protected otherContacts?: IIdAndBrief<IContactBrief>[];
	protected contactGroups: IContactGroupWithContacts[] = [];

	//
	@Input() filter = '';
	@Input({ required: true }) team?: ITeamContext;
	@Input() contacts?: IIdAndBrief<IContactBrief>[];
	@Input() goContact: (contact?: IIdAndBrief<IContactBrief>) => void = () =>
		void 0;
	@Input() goMember: (id: string, event: Event) => boolean = () => false;

	constructor(private readonly contactNavService: ContactNavService) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['contacts'] || changes['filter']) {
			this.setContactGroups();
		}
	}

	// TODO: have a single `id = (_, o: {id: string) => o.id` function once WebStorm bug is fixed
	protected readonly contactID = (_: number, o: IIdAndBrief<IContactBrief>) =>
		o.id;
	protected readonly roleID = (_: number, o: IContactRoleWithContacts) => o.id;
	protected readonly contactGroupID = (
		_: number,
		o: IContactGroupWithContacts,
	) => o.id;

	// hideRole(role: string): void {
	// 	if (!this.commune.id) {
	// 		throw new Error('!this.commune.id');
	// 	}
	// 	this.communeService.updateRecord(undefined, this.commune.id, dto => {
	// 		if (!dto.noContactRoles) {
	// 			dto = {...dto, noContactRoles: [role]};
	// 			return {dto, changed: true};
	// 		} else if (dto.noContactRoles.indexOf(role) < 0) {
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
		console.log('setContactGroups()', this.team, filter, contacts);
		const noContactRoles = this.team?.dto?.noContactRoles;
		let otherContacts = (this.otherContacts = !filter
			? contacts
			: contacts &&
			  contacts.filter((c) => c.brief?.title?.toLowerCase().includes(filter)));

		defaultFamilyContactGroups.forEach((group) => {
			const rolesWithContacts: IContactRoleWithContacts[] = [];
			group.dto?.roles?.forEach((role) => {
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
						roleWithContacts.contacts = roleWithContacts.contacts.filter(
							(c) => c?.brief?.title?.toLowerCase().includes(filter),
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
				...group.dto,
				id: group.id,
				title: group.dto?.title || '',
				roles: rolesWithContacts,
			};

			if (groupWithContacts.roles.length) {
				this.contactGroups?.push(groupWithContacts);
			}
		});
		this.otherContacts = otherContacts;
	}

	public addContact(event: Event, group: string, role?: ContactRole): void {
		event.stopPropagation();
		if (!this.team) {
			return;
		}
		this.contactNavService.goNewContactPage(this.team, { group, role });
	}
}
