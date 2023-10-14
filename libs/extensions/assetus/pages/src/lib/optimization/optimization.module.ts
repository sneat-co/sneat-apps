import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OptimizationPageComponent } from './optimization-page.component';

const routes: Routes = [
	{
		path: '',
		component: OptimizationPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
	],
	declarations: [OptimizationPageComponent],
})
export class OptimizationPageModule {}
