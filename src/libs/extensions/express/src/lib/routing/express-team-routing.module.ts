import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpressMenuComponent } from '../components/express-menu/express-menu.component';
import { ExpressMenuModule } from '../components/express-menu/express-menu.module';

@Component({ template: 'empty component' })
export class EmptyComponent {
}

export const expressRoutes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		loadChildren: () => import('../pages/express-main-page/express-main-page.module').then(m => m.ExpressMainPageModule),
	},
	{
		path: '',
		outlet: 'menu',
		// pathMatch: 'full',
		component: ExpressMenuComponent,
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
