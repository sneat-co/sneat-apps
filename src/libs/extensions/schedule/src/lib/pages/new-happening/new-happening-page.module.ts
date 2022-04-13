import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {NewHappeningPageComponent} from './new-happening-page.component';
import {RecurringCommonModule} from '../../components/recurring-common.module';

const routes: Routes = [
	{
		path: '',
		component: NewHappeningPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ReactiveFormsModule,
		RecurringCommonModule,
		RouterModule.forChild(routes)
	],
	declarations: [NewHappeningPageComponent]
})
export class NewHappeningPageModule {
}
