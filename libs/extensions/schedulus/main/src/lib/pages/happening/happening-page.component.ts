import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { HappeningBasePage } from './happening-base-page';
import {
	HappeningComponentBaseParams,
	HappeningComponentBaseParamsModule,
	HappeningFormComponent,
	HappeningServiceModule,
} from '@sneat/extensions/schedulus/shared';

@Component({
	selector: 'sneat-happening-page',
	templateUrl: './happening-page.component.html',
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
