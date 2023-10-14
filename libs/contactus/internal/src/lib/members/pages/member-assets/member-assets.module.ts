import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MemberAssetsPageComponent } from './member-assets-page-components.component';

const routes: Routes = [
	{
		path: '',
		component: MemberAssetsPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
	],
	declarations: [MemberAssetsPageComponent],
})
export class MemberAssetsPageModule {}
