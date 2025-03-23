import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { NewDebtFormComponent } from '@sneat/debtus-shared';
import {
	SpaceComponentBaseParams,
	SpacePageTitleComponent,
	SpacePageBaseComponent,
} from '@sneat/team-components';
import { SpaceServiceModule } from '@sneat/team-services';

@Component({
	selector: 'sneat-debtus-home-page',
	templateUrl: './debtus-home-page.component.html',
	imports: [
		CommonModule,
		IonicModule,
		SpacePageTitleComponent,
		NewDebtFormComponent,
		ContactusServicesModule,
		SpaceServiceModule,
	],
	providers: [SpaceComponentBaseParams],
})
export class DebtusHomePageComponent extends SpacePageBaseComponent {
	constructor() {
		super('DebtusHomePageComponent');
	}
}
