import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CountrySelectorComponent } from '@sneat/components';
import { SelectFromListComponent } from '@sneat/ui';
import {
	LocationFormComponent,
	NewCompanyFormComponent,
} from '@sneat/contactus-shared';
import { NewLogistCompanyPageComponent } from './new-logist-company-page.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		LocationFormComponent,
		SelectFromListComponent,
		RouterModule.forChild([
			{
				path: '',
				component: NewLogistCompanyPageComponent,
			},
		]),
		CountrySelectorComponent,
		NewCompanyFormComponent,
	],
	declarations: [NewLogistCompanyPageComponent],
})
export class NewLogistCompanyPageModule {}
