import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FreightOrdersServiceModule } from '@sneat/extensions/express';
import { OrdersListModule } from '../../components/orders-list/orders-list.module';
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
		OrdersListModule,
		FreightOrdersServiceModule,
	],
	declarations: [
		OrdersPageComponent,
	],
})
export class OrdersPageModule {
}
