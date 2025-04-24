import { Component } from '@angular/core';
import {
	IonBackButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { MemberBasePage } from '../member-base-page';
import { CommuneBasePageParams } from 'sneat-shared/services/params';
import { IMemberService } from 'sneat-shared/services/interfaces';

@Component({
	selector: 'sneat-member-assets',
	templateUrl: './member-assets-page-components.component.html',
	providers: [CommuneBasePageParams],
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
	constructor(params: CommuneBasePageParams, membersService: IMemberService) {
		super(params, membersService);
	}
}
