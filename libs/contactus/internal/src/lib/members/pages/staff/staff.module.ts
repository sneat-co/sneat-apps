import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {StaffPageComponent} from './staff-page.component';

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
	],
	declarations: [StaffPageComponent]
})
export class StaffPageModule {
}
