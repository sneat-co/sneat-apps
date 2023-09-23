import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PersonFormModule } from '@sneat/components';
import { TeamComponentsModule } from '@sneat/team/components';
import { NewMemberFormComponent } from './new-member-form.component';

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
		ReactiveFormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		TeamComponentsModule,
		PersonFormModule,
	],
	declarations: [
		NewMemberPageComponent,
		NewMemberFormComponent,
	],
})
export class NewMemberPageModule {
	// Can't simply make standalone as it includes NewMemberFormComponent
}
