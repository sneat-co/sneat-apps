import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

const childRoutes: Routes = [
	{
		path: '',
		loadChildren: () => import('./team/team-page-routing.module').then(m => m.TeamPageRoutingModule),
	},
];

const routes: Routes = [
	{
		path: 'team/:id',
		children: childRoutes,
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
