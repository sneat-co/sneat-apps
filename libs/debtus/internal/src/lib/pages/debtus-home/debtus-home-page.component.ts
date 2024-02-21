import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ContactsByTypeComponent } from '@sneat/contactus-shared';
import { NewDebtFormComponent } from '@sneat/debtus-shared';
import {
	TeamComponentBaseParams,
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
	],
})
export class DebtusHomePageComponent extends TeamPageBaseComponent {
	constructor(router: ActivatedRoute, teamParams: TeamComponentBaseParams) {
		super('DebtusHomePageComponent', router, teamParams);
	}
}
