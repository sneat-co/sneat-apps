import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ContactInputModule } from '@sneat/extensions/contactus';
import { FreightOrdersServiceModule } from '../services';
import { OrderCardComponent } from './order-card/order-card.component';
import { OrderPrintMenuComponent } from './order-card/order-print-menu.component';
import { OrderCounterpartyInputComponent } from './order-counterparty-input/order-counterparty-input.component';
import { OrderCounterpartyComponent } from './order-counterparty/order-counterparty.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		RouterModule,
		ContactInputModule,
		FreightOrdersServiceModule,
	],
	declarations: [
		OrderCardComponent,
		OrderPrintMenuComponent,
		OrderCounterpartyComponent,
		OrderCounterpartyInputComponent,
	],
  exports: [
    OrderCardComponent,
    OrderCounterpartyInputComponent,
  ],
})
export class OrderFormModule {
}
