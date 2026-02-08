import { Component, inject } from '@angular/core';
import {
	IonBackButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { MemberBasePage } from '../member-base-page';
import { ContactService } from '@sneat/contactus-services';

@Component({
	selector: 'sneat-member-budget',
	templateUrl: './member-budget-page.component.html',
	imports: [
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonContent,
	],
})
export class MemberBudgetPageComponent extends MemberBasePage {
	constructor() {
		super(inject(ContactService));
	}
}
