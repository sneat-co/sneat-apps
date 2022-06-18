import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FreightsAppHomePageComponent } from './freights-app-home-page.component';

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
	],
	declarations: [FreightsAppHomePageComponent],
})
export class FreightsAppHomePageModule {

}
