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
import { MemberBasePage } from '../member-base-page';
import { CommuneBasePageParams } from 'sneat-shared/services/params';
import { IMemberService } from 'sneat-shared/services/interfaces';

@Component({
	selector: 'sneat-member-documents',
	templateUrl: './member-documents-page.component.html',
	providers: [CommuneBasePageParams],
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
		const params = inject(CommuneBasePageParams);
		const membersService = inject(IMemberService);

		super(params, membersService);
	}
}
