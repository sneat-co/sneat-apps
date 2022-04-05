import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BudgetPageComponent } from './budget-page.component';

const routes: Routes = [
	{
		path: '',
		component: BudgetPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
	],
	declarations: [BudgetPageComponent],
})
export class BudgetPageModule {
}
