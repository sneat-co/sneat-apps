import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { HappeningServiceModule } from '@sneat/team-services';
import {
	HappeningComponentBaseParams,
	HappeningComponentBaseParamsModule,
} from '../../components/happening-component-base-params';
import { HappeningFormComponent } from '../../components/happening-form/happening-form.component';
import { HappeningBasePage } from './happening-base-page';

@Component({
	selector: 'sneat-happening-page',
	templateUrl: './happening-page.component.html',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		HappeningServiceModule,
		HappeningFormComponent,
		ContactusServicesModule,
		HappeningComponentBaseParamsModule,
	],
})
export class HappeningPageComponent extends HappeningBasePage {
	constructor(route: ActivatedRoute, params: HappeningComponentBaseParams) {
		super('HappeningPageComponent', route, params);
	}
}
