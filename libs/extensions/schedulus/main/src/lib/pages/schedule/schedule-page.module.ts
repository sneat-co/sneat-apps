import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TeamCoreComponentsModule } from '@sneat/team/components';
import { ScheduleComponentModule } from '../../components/schedule/schedule-component.module';

import { SchedulePageComponent } from './schedule-page.component';

const routes: Routes = [
	{
		path: '',
		component: SchedulePageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
		TeamCoreComponentsModule,
		ScheduleComponentModule,
	],
	declarations: [SchedulePageComponent],
	// providers: [
	// ]
})
export class SchedulePageModule {}
