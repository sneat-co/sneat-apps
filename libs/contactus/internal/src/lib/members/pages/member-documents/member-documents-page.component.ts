import { Component, inject } from '@angular/core';
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonItemGroup,
	IonLabel,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { ContactService } from '@sneat/contactus-services';
import { MemberBasePage } from '../member-base-page';

@Component({
	selector: 'sneat-member-documents',
	templateUrl: './member-documents-page.component.html',
	imports: [
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonContent,
		IonItemGroup,
		IonItemDivider,
		IonLabel,
		IonButton,
		IonIcon,
		IonItem,
	],
})
export class MemberDocumentsPageComponent extends MemberBasePage {
	constructor() {
		super(inject(ContactService));
	}
}
