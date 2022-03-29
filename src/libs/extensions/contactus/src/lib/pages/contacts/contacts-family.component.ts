import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ContactsBaseComponent, IContactGroup, IContactRole} from './contacts-base.component';
import {IRecord, RxRecordKey} from 'rxstore';
import {listItemAnimations} from '../../../../animations/list-animations';
import {Commune} from '../../../../models/ui/ui-models';
import {IContactDto} from '../../../../models/dto/dto-contact';
import {eq, ICommuneService} from '../../../../services/interfaces';

function familyContactGroups(): IContactGroup[] {
	return [
		{
			title: 'Medical',
			roles: [
				{id: 'gp', title: 'Family doctor', emoji: '👩‍⚕️', finder: 'gpconnect.app'},
			],
		},
		{
			title: 'House',
			roles: [
				{id: 'plumber', title: 'Plumber', emoji: '🚽', finder: 'plumbers.express'},
				{id: 'electrician', title: 'Electrician', emoji: '🔌', finder: 'electricians.express'},
				{id: 'gardener', title: 'Gardener', emoji: '👨‍🌾', finder: 'gardeners.express'},
			]
		},
		{
			title: 'Vehicles',
			roles: [
				{id: 'mechanic', title: 'Mechanic', emoji: '👨‍🔧'},
				{id: 'insurer', title: 'Insurer', emoji: '🧾'},
			]
		},
		{
			title: 'Kids',
			roles: [
				{id: 'teacher', title: 'Teacher', emoji: '👩‍🏫'},
				{id: 'babysitter', title: 'Babysitter', emoji: '👧', finder: 'babysitters.express'},
				{id: 'friends', title: 'Friends', emoji: '🚸'},
			]
		},
	];
}

@Component({
	selector: 'contactus-contacts-family',
	templateUrl: './contacts-family.component.html',
	animations: [listItemAnimations],
})
export class ContactsFamilyComponent extends ContactsBaseComponent implements OnChanges {

	@Input() filter: string;
	@Input() commune: Commune;
	@Input() contacts: IContactDto[];
	otherContacts: IContactDto[];

	public contactGroups: IContactGroup[];

	constructor(
		private readonly communeService: ICommuneService,
	) {
		super();
	}

	private setContactGroups(): void {
		this.contactGroups = [];
		const filter = this.filter;
		const contacts = this.contacts;
		console.log('setContactGroups()', this.commune, filter, contacts);
		const noContactRoles = this.commune && this.commune.dto.noContactRoles;
		let otherContacts = this.otherContacts = !filter ? contacts :
			contacts && contacts.filter(
			c => c.title && c.title.toLowerCase()
				.indexOf(filter) >= 0);
		familyContactGroups()
			.forEach(group => {
				const groupRoles = group.roles;
				if (contacts) {
					const roles: IContactRole[] = [];
					groupRoles.forEach(role => {
						role = {...role, contacts: contacts.filter(c => c.roles && c.roles.includes(role.id))};
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
								role.contacts = role.contacts.filter(c => c.title && c.title.toLowerCase()
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
					this.contactGroups.push(group);
				}
			});
		this.otherContacts = otherContacts;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.contacts || changes.commune || changes.filter) {
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

	// tslint:disable-next-line:prefer-function-over-method
	trackById(i: number, record: IRecord): RxRecordKey | undefined {
		return record.id;
	}
}
