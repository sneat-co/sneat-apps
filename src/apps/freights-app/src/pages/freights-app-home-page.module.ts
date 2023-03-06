import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FreightsAppHomePageComponent } from './freights-app-home-page.component';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { LogistMenuModule } from '@sneat/extensions/express'; // TODO: HELP WANTED: find how to fix it

const routes: Routes = [
	{
		path: '',
		component: FreightsAppHomePageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
		LogistMenuModule,
	],
	declarations: [FreightsAppHomePageComponent],
})
export class FreightsAppHomePageModule {

}
