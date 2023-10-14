import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PupilsPageComponent } from './pupils-page.component';

const routes: Routes = [
	{
		path: '',
		component: PupilsPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
	],
	declarations: [PupilsPageComponent],
})
export class PupilsPageModule {}
