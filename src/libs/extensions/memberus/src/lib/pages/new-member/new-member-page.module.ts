import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TeamPageContextModule } from '@sneat/team/components';

import { NewMemberPageComponent } from './new-member-page.component';

const routes: Routes = [
	{
		path: '',
		component: NewMemberPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		TeamPageContextModule,
	],
	declarations: [NewMemberPageComponent],
})
export class NewMemberPageModule {
}
