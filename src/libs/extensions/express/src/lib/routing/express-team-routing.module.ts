import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpressMenuComponent } from '../components/express-menu/express-menu.component';
import { ExpressMenuModule } from '../components/express-menu/express-menu.module';
import { ExpressTeamMenuComponent } from '../components/express-team-menu/express-team-menu.component';

@Component({ template: 'empty component' })
export class EmptyComponent {
}

export const expressRoutes: Routes = [
	{
		path: '',
		loadChildren: () => import('../pages/express-team-page/express-team-page.module').then(m => m.ExpressTeamPageModule),
	},
	{
		path: '',
		outlet: 'menu',
		// loadChildren: () => import('../components/express-team-menu/express-team-menu.module').then(m => m.ExpressTeamMenuModule),
		component: ExpressTeamMenuComponent,
	},
	{
		path: 'counterparties',
		pathMatch: 'full',
		loadChildren: () => import('../pages/counterparties-page/counterparties-page.module').then(m => m.CounterpartiesPageModule),
	},
	{
		path: 'freights',
		pathMatch: 'full',
		loadChildren: () => import('../pages/freights-page/freights-page.module').then(m => m.FreightsPageModule),
	},
	{
		path: 'freights/:freightID',
		loadChildren: () => import('../pages/freight-page/freight-page.module').then(m => m.FreightPageModule),
	},
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(expressRoutes.map(r => ({ ...r, path: r.path?.replace('express/', '') }))),
		ExpressMenuModule,
	],
	declarations: [
		EmptyComponent,
	],
})
export class ExpressTeamRoutingModule {
}
