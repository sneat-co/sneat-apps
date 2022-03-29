import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamMenuComponent, TeamMenuComponentModule } from '@sneat/team/components';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SneatAuthModule } from '@sneat/auth';

const routes: Routes = [
	{
		path: '',
		component: TeamMenuComponent,
		outlet: 'menu',
	},
	{
		path: '',
		pathMatch: 'full',
		loadChildren: () => import('./team-page/team-page.module').then(m => m.TeamPageModule),
	},
	// {
	// 	path: '',
	// 	component: SpacePageComponent, // intentionally not lazy loading
	// 	pathMatch: 'full',
	// 	children: [
	// 		{
	// 			path: '',
	// 			pathMatch: 'full',
	// 			loadChildren: () => import('./team-page/team-page.module').then(m => m.TeamPageModule),
	// 		},
	// 	],
	// },
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		IonicModule,
		SneatAuthModule,
		TeamMenuComponentModule,
	],
	exports: [RouterModule],
	declarations: [],
})
export class TeamSpaceRoutingModule {
}
