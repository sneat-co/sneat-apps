import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { ContactServiceModule } from '@sneat/team/contacts/services';
import { LocationFormModule } from '../../components';
import { ContactComponentBaseParams } from '../../contact-component-base-params';
import { ContactBasePage } from '../contact-base-page';
import { NewLocationPageComponent } from './new-location-page.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		ContactServiceModule,
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
