import { Component } from '@angular/core';
import {
	IonBackButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonToolbar,
} from '@ionic/angular/standalone';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { NewDebtFormComponent } from '@sneat/ext-debtus-shared';
import {
	SpaceComponentBaseParams,
	SpacePageTitleComponent,
	SpacePageBaseComponent,
} from '@sneat/space-components';
import { SpaceServiceModule } from '@sneat/space-services';

@Component({
	selector: 'sneat-debtus-home-page',
	templateUrl: './debtus-home-page.component.html',
	imports: [
		SpacePageTitleComponent,
		NewDebtFormComponent,
		ContactusServicesModule,
		SpaceServiceModule,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonContent,
	],
	providers: [SpaceComponentBaseParams],
})
export class DebtusHomePageComponent extends SpacePageBaseComponent {
	constructor() {
		super('DebtusHomePageComponent');
	}
}
