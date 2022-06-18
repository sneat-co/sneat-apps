import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SneatAuthRoutingModule } from '@sneat/auth-ui';
// import { SneatAppMyRoutingModule } from './sneat-app-my-routing.module';

const routes: Routes = [
	{
		path: 'company/:teamID',
		loadChildren: () => import('@sneat/extensions/express').then(m => m.ExpressTeamRoutingModule),
	},

];

@NgModule({
	imports: [
		// RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
		SneatAuthRoutingModule,
		// RoutesToCommuneModule,
	],
	exports: [
		RouterModule,
	],
})
export class FreightsAppRoutingModule {
}
