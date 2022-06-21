import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FreightsListModule } from '../../components/freights-list/freights-list.module';
import { OrdersPageComponent } from './orders-page.component';

const routes: Routes = [
	{
		path: '',
		component: OrdersPageComponent,
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
		OrdersPageComponent,
	],
})
export class OrdersPageModule {
}
