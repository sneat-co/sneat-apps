import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TeamPage } from './team.page';
import { IonicModule } from "@ionic/angular";

const routes: Routes = [
	{
		path: '',
		component: TeamPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class TeamPageRoutingModule {}
