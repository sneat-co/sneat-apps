import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FreightsListModule } from '../../components/freights-list/freights-list.module';
import { FreightsPageComponent } from './freights-page.component';

const routes: Routes = [
	{
		path: '',
		component: FreightsPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
		FormsModule,
		FreightsListModule,
	],
	declarations: [
		FreightsPageComponent,
	],
})
export class FreightsPageModule {
}
