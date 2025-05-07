import { Component, Input } from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonInput,
	IonItem,
	IonLabel,
} from '@ionic/angular/standalone';
import { IIdAndBriefAndOptionalDbo } from '@sneat/core';
import { IContactBrief, IContactDbo } from '@sneat/contactus-core';

@Component({
	selector: 'sneat-contact-dob',
	templateUrl: './contact-dob.component.html',
	imports: [IonItem, IonInput, IonButtons, IonButton, IonLabel],
})
export class ContactDobComponent {
	@Input({ required: true }) public contact?: IIdAndBriefAndOptionalDbo<
		IContactBrief,
		IContactDbo
	>;
}
