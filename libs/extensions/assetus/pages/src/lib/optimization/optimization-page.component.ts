import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonContent,
	IonHeader,
	IonIcon,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { CommuneBasePageParams } from 'sneat-shared/services/params';
import { CommuneBasePage } from 'sneat-shared/pages/commune-base-page';
import { CommuneTopPage } from '../../../../pages/constants';

@Component({
	selector: 'sneat-optimization',
	templateUrl: './optimization-page.component.html',
	providers: [CommuneBasePageParams],
	imports: [
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		NgIf,
		IonContent,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardContent,
		IonButton,
		IonIcon,
	],
})
export class OptimizationPageComponent extends CommuneBasePage {
	constructor() {
		const params = inject(CommuneBasePageParams);

		super(CommuneTopPage.home, params);
	}
}
