import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { HappeningPageFormModule } from '../../components/happening-page-form/happening-page-form.module';

import { NewHappeningPageComponent } from './new-happening-page.component';

const routes: Routes = [
	{
		path: '',
		component: NewHappeningPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		SneatPipesModule,
		HappeningPageFormModule,
	],
	declarations: [NewHappeningPageComponent],
})
export class NewHappeningPageModule {
}
