import { JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
	IonButton,
	IonCard,
	IonIcon,
	IonInput,
	IonItem,
	IonItemDivider,
	IonLabel,
} from '@ionic/angular/standalone';
import { IIdAndBriefAndOptionalDbo } from '@sneat/core';
import { IContactBrief } from '@sneat/contactus-core';

@Component({
	selector: 'sneat-contact-contacts',
	templateUrl: 'contact-contacts.component.html',
	imports: [
		IonCard,
		IonItemDivider,
		IonLabel,
		IonItem,
		IonInput,
		IonButton,
		IonIcon,
		JsonPipe,
	],
})
export class ContactContactsComponent {
	@Input({ required: true }) public contact?: IIdAndBriefAndOptionalDbo<
		IContactBrief,
		IContactBrief
	>;
}
