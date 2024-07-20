import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { ContactsByTypeComponent } from '@sneat/contactus-shared';
import { NewDebtFormComponent } from '@sneat/debtus-shared';
import {
	SpaceComponentBaseParams,
	TeamCoreComponentsModule,
	TeamPageBaseComponent,
} from '@sneat/team-components';

@Component({
	selector: 'sneat-debtus-home-page',
	templateUrl: './debtus-home-page.component.html',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		ContactsByTypeComponent,
		TeamCoreComponentsModule,
		NewDebtFormComponent,
		ContactusServicesModule,
	],
	providers: [SpaceComponentBaseParams],
})
export class DebtusHomePageComponent extends TeamPageBaseComponent {
	constructor(router: ActivatedRoute, teamParams: SpaceComponentBaseParams) {
		super('DebtusHomePageComponent', router, teamParams);
	}
}
