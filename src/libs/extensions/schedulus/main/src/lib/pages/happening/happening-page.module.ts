import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { HappeningServiceModule } from '@sneat/team/services';
import { HappeningFormComponent } from '../../components/happening-form/happening-form.component';
import { HappeningSlotComponentsModule } from '../../components/happening-slot-components.module';

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
		HappeningSlotComponentsModule,
		RouterModule.forChild(routes),
		HappeningServiceModule,
		HappeningFormComponent,
	],
	declarations: [HappeningPageComponent],
})
export class HappeningPageModule {
}
