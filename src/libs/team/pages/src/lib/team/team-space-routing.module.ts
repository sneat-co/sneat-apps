import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatAuthServicesModule } from '@sneat/auth';
import { AssetusRoutingModule } from '@sneat/extensions/assetus/pages';
import { budgetusRoutes } from '@sneat/extensions/budgetus';
import { ContactusRoutingModule } from '@sneat/extensions/contactus';
import { docusRoutes } from '@sneat/extensions/docus';
import { expressRoutes } from '@sneat/extensions/express';
import { listusRoutes } from '@sneat/extensions/listus';
import { memberRoutes, membersRoutes } from '@sneat/extensions/memberus';
import { schedulusRoutes } from '@sneat/extensions/schedulus/main';
import { TeamComponentBaseParams, TeamMenuComponent, TeamMenuComponentModule } from '@sneat/team/components';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: TeamMenuComponent,
		outlet: 'menu',
	},
	{
		path: '',
		// pathMatch: 'full',
		loadChildren: () => import('./team-page/team-page.module').then(m => m.TeamPageModule),
	},
	...memberRoutes, // E.g. "./new-member"
	{
		path: 'member/:memberId',
		loadChildren: () => import('@sneat/extensions/memberus').then(m => m.MemberRoutingModule),
	},
	{
		path: 'member/:memberId',
		loadChildren: () => import('@sneat/extensions/memberus').then(m => m.MemberRoutingModule),
	},
	{
		path: 'express',
		loadChildren: () => import('@sneat/extensions/express').then(m => m.ExpressRoutingModule),
	},
	...budgetusRoutes,
	...docusRoutes,
	...listusRoutes,
	...schedulusRoutes,
	...membersRoutes,
	// ...expressRoutes,
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
		ContactusRoutingModule,
	],
	exports: [RouterModule],
	declarations: [],
	providers: [
		TeamComponentBaseParams,
	],
})
export class TeamSpaceRoutingModule {
}
