import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { eq, listItemAnimations } from '@sneat/core';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { IContactGroup, IContactRole } from './contacts-base.component';

function familyContactGroups(): IContactGroup[] {
	return [
		{
			id: 'kids',
			title: 'Kids',
			roles: [
				{ id: 'teacher', title: 'Teacher', emoji: '👩‍🏫' },
				{ id: 'babysitter', title: 'Babysitter', emoji: '👧', finder: 'babysitters.express' },
				{ id: 'friends', title: 'Friends', emoji: '🚸' },
			],
		},
		{
			id: 'medics',
			title: 'Medical',
			roles: [
				{ id: 'gp', title: 'Family doctor', emoji: '👩‍⚕️', finder: 'gpconnect.app' },
			],
		},
		{
			id: 'house',
			title: 'House',
			roles: [
				{ id: 'plumber', title: 'Plumber', emoji: '🚽', finder: 'plumbers.express' },
				{ id: 'electrician', title: 'Electrician', emoji: '🔌', finder: 'electricians.express' },
				{ id: 'gardener', title: 'Gardener', emoji: '👨‍🌾', finder: 'gardeners.express' },
				{ id: 'insurer', title: 'Insurer', emoji: '🧾' },
			],
		},
		{
			id: 'vehicles',
			title: 'Vehicles',
			roles: [
				{ id: 'mechanic', title: 'Mechanic', emoji: '👨‍🔧' },
				{ id: 'insurer', title: 'Insurer', emoji: '🧾' },
			],
		},
	];
}

@Component({
	selector: 'sneat-contacts-family',
	templateUrl: './contacts-family.component.html',
	animations: [listItemAnimations],
})
export class ContactsFamilyComponent implements OnChanges {

	public otherContacts?: IContactContext[];
	public contactGroups: IContactGroup[] = [];
	//
	@Input() filter = '';
	@Input() team?: ITeamContext;
	@Input() contacts?: IContactContext[];
	@Input() goContact: (contact?: IContactContext) => void = () => void 0;
	@Input() goMember: (id: string, event: Event) => boolean = () => false;


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
		familyContactGroups()
			.forEach(group => {
				const groupRoles = group.roles;
				if (contacts) {
					const roles: IContactRole[] = [];
					groupRoles.forEach(role => {
						role = { ...role, contacts: contacts.filter(c => c.dto?.roles && c.dto?.roles.includes(role.id)) };
						if (filter && role.title.toLowerCase()
							.indexOf(filter) >= 0) {
							roles.push(role); // Show all contacts in role that filtered by title
							return;
						}
						if (role.contacts) {
							role.contacts.forEach(c => {
								otherContacts = otherContacts.filter(oc => !eq(oc.id, c.id));
							});
							if (role.contacts.length && filter) {
								role.contacts = role.contacts.filter(c => c?.brief?.title && c?.brief?.title.toLowerCase()
									.indexOf(filter) >= 0);
								if (role.contacts.length) {
									roles.push(role);
								}
							}
						}
						if (!filter && (!noContactRoles || noContactRoles.indexOf(role.id) < 0)) {
							roles.push(role);
						}
					});
					group.roles = roles;
				}
				if (group.roles.length) {
					this.contactGroups?.push(group);
				}
			});
		this.otherContacts = otherContacts;
	}
}
