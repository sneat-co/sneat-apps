import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ContactInputComponent } from '@sneat/contactus-shared';
import { LogistOrderServiceModule } from '../services';
import {
	AgentRoleMenuComponent,
	OrderAgentsComponent,
} from './order-agents/order-agents.component';
import { OrderCardComponent } from './order-card/order-card.component';
import { OrderPrintMenuComponent } from './order-card/order-print-menu.component';
import { OrderCounterpartiesComponent } from './order-counterparties/order-counterparties.component';
import { OrderCounterpartyInputComponent } from './order-counterparty-input/order-counterparty-input.component';
import { OrderCounterpartyComponent } from './order-counterparty/order-counterparty.component';
// import { OrderShippingPointsCardComponent } from './order-shipping-points-card/order-shipping-points-card.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		RouterModule,
		ContactInputComponent,
		LogistOrderServiceModule,
	],
	declarations: [
		OrderCardComponent,
		OrderPrintMenuComponent,
		OrderCounterpartyComponent,
		OrderCounterpartyInputComponent,
		OrderCounterpartiesComponent,
		OrderAgentsComponent,
		AgentRoleMenuComponent,
		// OrderShippingPointsCardComponent,
	],
	exports: [
		OrderCardComponent,
		OrderCounterpartyInputComponent,
		OrderCounterpartyComponent,
		OrderCounterpartiesComponent,
		OrderAgentsComponent,
		// OrderShippingPointsCardComponent,
	],
})
export class OrderFormModule {}
