import { NgModule } from '@angular/core';
import { CommuneMenuComponent } from './commune-menu/commune-menu.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
	{
		path: 'family',
		loadChildren: () => import('./commune-page/commune-page.module').then(m => m.CommunePageModule),
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
	],
	declarations: [
		CommuneMenuComponent,
	],
	exports: [
		CommuneMenuComponent,
	],
})
export class CommunesUiModule {
	// Empty module required for nx generate
	// Otherwise `nx g component` fails
}
