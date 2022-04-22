import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { RecurringCommonModule } from '../../../components/recurring-common.module';
import { RecurringHappeningServiceModule } from '../../../services/recurring-happening.service';

import { RecurringHappeningPageComponent } from './recurring-happening-page.component';

const routes: Routes = [
	{
		path: '',
		component: RecurringHappeningPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RecurringCommonModule,
		RouterModule.forChild(routes),
		RecurringHappeningServiceModule,
	],
	declarations: [RecurringHappeningPageComponent],
})
export class RecurringHappeningPageModule {
}
