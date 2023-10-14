import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { HappeningFormComponent } from '../../components/happening-form/happening-form.component';

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
		HappeningFormComponent,
	],
	declarations: [NewHappeningPageComponent],
})
export class NewHappeningPageModule {}
