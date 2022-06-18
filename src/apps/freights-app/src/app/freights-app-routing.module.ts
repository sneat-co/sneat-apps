import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SneatAuthRoutingModule } from '@sneat/auth-ui';
import {
	ExpressMenuComponent
} from '../../../../libs/extensions/express/src/lib/components/express-menu/express-menu.component';
// import { SneatAppMyRoutingModule } from './sneat-app-my-routing.module';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		loadChildren: () => import('../pages/freights-app-home-page.module').then(m => m.FreightsAppHomePageModule),
	},
	{
		path: '',
		outlet: 'menu',
		pathMatch: 'full',
		// loadChildren: () => import('@sneat/extensions/express').then(m => m.ExpressTeamMenuModule),
		component: ExpressMenuComponent,
	},
	{
		path: 'company/:teamID',
		loadChildren: () => import('@sneat/extensions/express').then(m => m.ExpressTeamRoutingModule),
	},

];

@NgModule({
	imports: [
		RouterModule.forRoot(routes/*, { preloadingStrategy: PreloadAllModules }*/),
		SneatAuthRoutingModule,
		// RoutesToCommuneModule,
	],
	exports: [
		RouterModule,
	],
})
export class FreightsAppRoutingModule {
}
