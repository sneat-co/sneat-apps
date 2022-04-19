import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {StaffPageComponent} from './staff-page.component';
import {SneatAppComponentsModule} from '../../../../../projects/sneat-app/src/app/components/sneat-app-components.module';

const routes: Routes = [
	{
		path: '',
		component: StaffPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		SneatAppComponentsModule,
	],
	declarations: [StaffPageComponent]
})
export class StaffPageModule {
}
