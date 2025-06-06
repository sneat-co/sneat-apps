import { Component, inject } from '@angular/core';
import {
	IonBackButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { ContactService } from '@sneat/contactus-services';
import { MemberBasePage } from '../member-base-page';

@Component({
	selector: 'sneat-member-assets',
	templateUrl: './member-assets-page-components.component.html',
	imports: [
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonContent,
	],
})
export class MemberAssetsPageComponent extends MemberBasePage {
	constructor() {
		const contactService = inject(ContactService);

		super('MemberAssetsPageComponent', contactService);
	}
}
