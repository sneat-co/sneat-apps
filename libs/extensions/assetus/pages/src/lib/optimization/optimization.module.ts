import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { OptimizationPageComponent } from './optimization-page.component';

const routes: Routes = [
	{
		path: '',
		component: OptimizationPageComponent,
	},
];

@NgModule({
	imports: [FormsModule, RouterModule.forChild(routes)],
	declarations: [OptimizationPageComponent],
})
export class OptimizationPageModule {}
