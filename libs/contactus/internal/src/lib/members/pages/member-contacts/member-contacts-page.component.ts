import { Component, inject } from '@angular/core';
import {
	IonBackButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonLabel,
	IonSegment,
	IonSegmentButton,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { CommuneBasePageParams } from 'sneat-shared/services/params';
import { MemberBasePage } from '../member-base-page';
import {
	IAssetService,
	IMemberService,
} from 'sneat-shared/services/interfaces';
import { NgModulePreloaderService } from 'sneat-shared/services/ng-module-preloader.service';

@Component({
	selector: 'sneat-member-contacts',
	templateUrl: './member-contacts-page.component.html',
	providers: [CommuneBasePageParams],
	imports: [
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonContent,
		IonSegment,
		IonSegmentButton,
		IonLabel,
	],
})
export class MemberContactsPageComponent extends MemberBasePage {
	public override segment: 'friends' | 'other' = 'friends';

	constructor() {
		const params = inject(CommuneBasePageParams);
		const membersService = inject(IMemberService);
		const preloader = inject(NgModulePreloaderService);
		const assetService = inject(IAssetService);

		super(params, membersService, preloader, assetService);
	}
}
