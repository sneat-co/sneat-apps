import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { HappeningPageFormModule } from '../../components/happening-page-form/happening-page-form.module';
import { RecurringCommonModule } from '../../components/recurring-common.module';
import { HappeningServiceModule } from '../../services/happening.service';

import { HappeningPageComponent } from './happening-page.component';

const routes: Routes = [
	{
		path: '',
		component: HappeningPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RecurringCommonModule,
		RouterModule.forChild(routes),
		HappeningServiceModule,
		HappeningPageFormModule,
	],
	declarations: [HappeningPageComponent],
})
export class HappeningPageModule {
}
