import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OrderFormModule } from '../order-form.module';
import { OrdersListComponent } from './orders-list.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		OrderFormModule,
		CommonModule,
	],
	declarations: [OrdersListComponent],
	exports: [OrdersListComponent],
})
export class OrdersListModule {}
