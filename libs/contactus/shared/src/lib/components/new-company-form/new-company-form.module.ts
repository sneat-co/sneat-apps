import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SelectFromListModule } from '@sneat/components';
import { LocationFormModule } from '../location-form';
import { NewCompanyFormComponent } from './new-company-form.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		LocationFormModule,
		SelectFromListModule,
		FormsModule,
	],
	declarations: [NewCompanyFormComponent],
	exports: [NewCompanyFormComponent],
})
export class NewCompanyFormModule {}
