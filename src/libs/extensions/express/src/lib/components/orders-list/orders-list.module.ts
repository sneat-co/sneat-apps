import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OrderCardComponent } from '../order-card/order-card.component';
import { OrdersListComponent } from './orders-list.component';


@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
	],
	declarations: [
		OrdersListComponent,
		OrderCardComponent,
	],
	exports: [
		OrdersListComponent,
		OrderCardComponent,
	],
})
export class OrdersListModule {
}
