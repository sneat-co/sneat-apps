import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DatagridModule } from '@sneat/datagrid';
import { OrderFormModule } from '../order-form.module';
import { OrdersGridComponent } from './orders-grid.component';


@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		OrderFormModule,
		DatagridModule,
	],
	declarations: [
		OrdersGridComponent,
	],
	exports: [
		OrdersGridComponent,
	],
})
export class OrdersGridModule {
}
