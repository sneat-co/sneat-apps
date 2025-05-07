import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonItemGroup,
	IonItemSliding,
	IonLabel,
} from '@ionic/angular/standalone';
import { ContactType, IContact2Asset } from '@sneat/contactus-core';

@Component({
	selector: 'sneat-asset-contacts-group',
	templateUrl: './asset-contacts-group.component.html',
	imports: [
		IonItemGroup,
		IonItemDivider,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		IonItem,
		IonItemSliding,
	],
})
export class AssetContactsGroupComponent {
	@Input() contactRelation?: ContactType;
	@Input() contacts?: IContact2Asset[];

	get title(): string {
		switch (this.contactRelation) {
			case 'landlord':
				return 'Landlord';
			case 'tenant':
				return 'Tenants';
			default:
				return this.contactRelation || '';
		}
	}

	get addTitle(): string {
		switch (this.contactRelation) {
			case 'landlord':
				return 'Add landlord';
			case 'tenant':
				return 'Add tenant';
			default:
				return 'Add' + this.contactRelation || '';
		}
	}

	@Output() goNewContact = new EventEmitter<ContactType>();
}
