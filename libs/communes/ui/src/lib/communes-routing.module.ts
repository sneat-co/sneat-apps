import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('./communes-page/communes-page.component').then(
				(m) => m.CommunesPageComponent,
			),
	},
	{
		path: 'new',
		loadComponent: () =>
			import('./new-commune-page/new-commune-page.component').then(
				(m) => m.NewCommunePageComponent,
			),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
})
export class CommunesRoutingModule {}
