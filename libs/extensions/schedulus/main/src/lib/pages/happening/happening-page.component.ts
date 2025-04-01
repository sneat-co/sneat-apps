import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
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
		FormsModule,
		IonicModule,
		HappeningServiceModule,
		HappeningFormComponent,
		ContactusServicesModule,
		HappeningComponentBaseParamsModule,
		SpaceServiceModule,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HappeningPageComponent extends HappeningBasePage {
	constructor(params: HappeningComponentBaseParams) {
		super('HappeningPageComponent', params);
	}
}
