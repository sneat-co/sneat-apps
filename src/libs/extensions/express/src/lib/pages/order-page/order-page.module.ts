import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FreightsListModule } from '../../components/freights-list/freights-list.module';
import { OrderPageComponent } from './order-page.component';

const routes: Routes = [
	{
		path: '',
		component: OrderPageComponent,
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
		OrderPageComponent,
	],
})
export class OrderPageModule {
}
