import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { eq, listItemAnimations } from '@sneat/core';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { defaultContactGroups, IContactGroup, IContactRoleBrief } from '../../contact-group.service';
import { ContactNavService } from '../../contact-nav-service';
import { IContactGroupWithContacts, IContactRoleWithContacts } from './ui-types';


@Component({
	selector: 'sneat-contacts-family',
	templateUrl: './contacts-by-type.component.html',
	animations: [listItemAnimations],
})
export class ContactsByTypeComponent implements OnChanges {

	public otherContacts?: IContactContext[];
	public contactGroups: IContactGroupWithContacts[] = [];
	//
	@Input() filter = '';
	@Input() team?: ITeamContext;
	@Input() contacts?: IContactContext[];
	@Input() goContact: (contact?: IContactContext) => void = () => void 0;
	@Input() goMember: (id: string, event: Event) => boolean = () => false;

	constructor(
		private readonly contactNavService: ContactNavService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['contacts'] || changes['team'] || changes['filter']) {
			this.setContactGroups();
		}
	}

	readonly id = (i: number, item: { id: string }) => item.id;

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
		let otherContacts = this.otherContacts = !filter ? contacts :
			contacts && contacts.filter(
				c => c.brief?.title && c.brief?.title.toLowerCase()
					.indexOf(filter) >= 0);

		defaultContactGroups
			.forEach(group => {

				const groupRoles = group.roles;

				const roles: IContactRoleWithContacts[] = [];
				groupRoles.forEach(role => {
					const roleWithContacts: IContactRoleWithContacts = {
						...role,
						contacts: contacts.filter(c => c.dto?.roles && c.dto?.roles.includes(role.id)),
					};
					if (filter && role.title.toLowerCase()
						.indexOf(filter) >= 0) {
						roles.push(roleWithContacts); // Show all contacts in role that filtered by title
						return;
					}
					if (roleWithContacts.contacts) {
						roleWithContacts.contacts.forEach(c => {
							otherContacts = otherContacts.filter(oc => !eq(oc.id, c.id));
						});
						if (roleWithContacts.contacts.length && filter) {
							roleWithContacts.contacts = roleWithContacts.contacts.filter(c => c?.brief?.title && c?.brief?.title.toLowerCase()
								.indexOf(filter) >= 0);
							if (roleWithContacts.contacts.length) {
								roles.push(roleWithContacts);
							}
						}
					}
					if (!filter && (!noContactRoles || noContactRoles.indexOf(role.id) < 0)) {
						roles.push(roleWithContacts);
					}
				});

				const groupWithContacts: IContactGroupWithContacts = { ...group, roles };

				if (groupWithContacts.roles.length) {
					this.contactGroups?.push(groupWithContacts);
				}
			});
		this.otherContacts = otherContacts;
	}

	public addContact(event: Event, group: string, type?: string): void {
		event.stopPropagation();
		if (!this.team) {
			return;
		}
		this.contactNavService.goNewContactPage(this.team, { group, type });
	}
}
