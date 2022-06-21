import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CountrySelectorModule, SelectFromListModule } from '@sneat/components';
import { ContactServiceModule } from '@sneat/extensions/contactus';
import { NewExpressCompanyPageComponent } from './new-express-company-page.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		SelectFromListModule,
		ContactServiceModule,
		RouterModule.forChild([
			{
				path: '',
				component: NewExpressCompanyPageComponent,
			},
		]),
		CountrySelectorModule,
	],
	declarations: [
		NewExpressCompanyPageComponent,
	],
})
export class NewExpressCompanyPageModule {
}
