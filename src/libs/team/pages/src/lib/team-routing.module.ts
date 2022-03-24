import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

const teamRoutes: Routes = [
	{
		path: '',
		loadChildren: () => import('./team/team-page.module').then(m => m.TeamPageModule),
	},
];

const routes: Routes = [
	{
		path: 'teams',
		loadChildren: () => import('./teams/teams-page.module').then(m => m.TeamsPageModule),
	},
	{
		path: 'team',
		redirectTo: 'teams',
		pathMatch: 'full',
	},
	{
		path: 'team/:id',
		children: teamRoutes,
	},
];


@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
	],
})
export class TeamRoutingModule {
}
