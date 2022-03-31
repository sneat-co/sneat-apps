import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ContactType} from 'sneat-shared/models/types';
import {IContact2Asset} from 'sneat-shared/models/dto/dto-contact';

@Component({
	selector: 'app-asset-contacts-group',
	templateUrl: './asset-contacts-group.component.html',
})
export class AssetContactsGroupComponent {

	@Input() contactRelation: ContactType;
	@Input() contacts: IContact2Asset[];

	get title(): string {
		switch (this.contactRelation) {
			case 'landlord':
				return 'Landlord';
			case 'tenant':
				return 'Tenants';
			default:
				return this.contactRelation;
		}
	}

	get addTitle(): string {
		switch (this.contactRelation) {
			case 'landlord':
				return 'Add landlord';
			case 'tenant':
				return 'Add tenant';
			default:
				return this.contactRelation;
		}
	}

	@Output() goNewContact = new EventEmitter<ContactType>();
}
