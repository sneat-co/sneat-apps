import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatAuthServicesModule } from '@sneat/auth';
import { AssetusRoutingModule } from '@sneat/extensions/assetus/pages';
import { memberRoutes } from '@sneat/extensions/memberus';
import { TeamComponentBaseParams, TeamMenuComponent, TeamMenuComponentModule } from '@sneat/team/components';

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
	...memberRoutes, // E.g. "./new-member"
	{
		path: 'member/:memberId',
		loadChildren: () => import('@sneat/extensions/memberus').then(m => m.MemberRoutingModule),
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
		SneatAuthServicesModule,
		TeamMenuComponentModule,
		AssetusRoutingModule,
	],
	exports: [RouterModule],
	declarations: [],
	providers: [
		TeamComponentBaseParams,
	]
})
export class TeamSpaceRoutingModule {
}
