import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {MemberBudgetPageComponent} from './member-budget-page.component';

const routes: Routes = [
	{
		path: '',
		component: MemberBudgetPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
	],
	declarations: [MemberBudgetPageComponent],
})
export class MemberBudgetPageModule {
}
