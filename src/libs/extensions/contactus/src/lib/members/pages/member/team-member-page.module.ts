import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { MemberAppsMenuComponent } from './components/member-apps-menu.component';

import { TeamMemberPageComponent } from './team-member-page.component';

const routes: Routes = [
	{
		path: '',
		component: TeamMemberPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		SneatPipesModule,
	],
	declarations: [
		TeamMemberPageComponent,
		MemberAppsMenuComponent,
	],
})
export class TeamMemberPageModule {
}
