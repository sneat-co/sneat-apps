import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {RegularHappeningPageComponent} from './regular-happening-page.component';
import {RegularCommonModule} from '../../components/regular-common.module';

const routes: Routes = [
	{
		path: '',
		component: RegularHappeningPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RegularCommonModule,
		RouterModule.forChild(routes)
	],
	declarations: [RegularHappeningPageComponent]
})
export class RegularHappeningPageModule {
}
