import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('./communes-page/communes-page.module').then(
				(m) => m.CommunesPageModule,
			),
	},
	{
		path: 'new',
		loadChildren: () =>
			import('./new-commune-page/new-commune-page.module').then(
				(m) => m.NewCommunePageModule,
			),
	},
];

@NgModule({
	imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
})
export class CommunesRoutingModule {}
