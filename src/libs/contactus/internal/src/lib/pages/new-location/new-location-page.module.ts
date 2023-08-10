import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { ContactComponentBaseParams, LocationFormModule } from '@sneat/contactus-shared';
import { ContactBasePage } from '../contact-base-page';
import { NewLocationPageComponent } from './new-location-page.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild([
			{
				path: '',
				component: NewLocationPageComponent,
			},
		]),
		LocationFormModule,
		SneatPipesModule,
	],
	providers: [ContactComponentBaseParams],
	declarations: [NewLocationPageComponent],
})
export class NewLocationPageModule extends ContactBasePage {

	constructor(
		route: ActivatedRoute,
		params: ContactComponentBaseParams,
	) {
		super('ContactPageComponent', route, params);
		this.defaultBackPage = 'contacts';
	}
}
