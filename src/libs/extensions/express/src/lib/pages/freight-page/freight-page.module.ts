import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FreightsListModule } from '../../components/freights-list/freights-list.module';
import { FreightPageComponent } from './freight-page.component';

const routes: Routes = [
	{
		path: '',
		component: FreightPageComponent,
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
		FreightPageComponent,
	],
})
export class FreightPageModule {
}
