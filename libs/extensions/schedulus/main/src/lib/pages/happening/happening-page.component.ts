import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	IonBackButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonMenuButton,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { SpaceServiceModule } from '@sneat/space-services';
import { HappeningBasePage } from './happening-base-page';
import {
	HappeningComponentBaseParams,
	HappeningComponentBaseParamsModule,
	HappeningFormComponent,
	HappeningServiceModule,
} from '@sneat/extensions-schedulus-shared';

@Component({
	selector: 'sneat-happening-page',
	templateUrl: './happening-page.component.html',
	imports: [
		HappeningServiceModule,
		HappeningFormComponent,
		ContactusServicesModule,
		HappeningComponentBaseParamsModule,
		SpaceServiceModule,
		IonHeader,
		IonButtons,
		IonToolbar,
		IonMenuButton,
		IonBackButton,
		IonTitle,
		IonContent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HappeningPageComponent extends HappeningBasePage {
	constructor(params: HappeningComponentBaseParams) {
		super('HappeningPageComponent', params);
	}
}
