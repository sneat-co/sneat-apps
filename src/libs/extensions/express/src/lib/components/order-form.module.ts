import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ContactInputModule } from '@sneat/extensions/contactus';
import { OrderCardComponent } from './order-card/order-card.component';
import { OrderCounterpartyInputComponent } from './order-counterparty-input/order-counterparty-input.component';
import { OrderCounterpartyComponent } from './order-counterparty/order-counterparty.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule,
    ContactInputModule,
  ],
	declarations: [
		OrderCardComponent,
		OrderCounterpartyComponent,
		OrderCounterpartyInputComponent,
	],
	exports: [
		OrderCardComponent,
	],
})
export class OrderFormModule {
}
