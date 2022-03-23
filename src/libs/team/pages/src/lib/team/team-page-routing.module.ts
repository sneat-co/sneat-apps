import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TeamPageComponent } from './team-page.component';
import { IonicModule } from "@ionic/angular";

const routes: Routes = [
	{
		path: '',
		component: TeamPageComponent,
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class TeamPageRoutingModule {}
