import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ContactServiceModule } from '@sneat/extensions/contactus';
import { LogistOrderServiceModule } from '../../services';
import { OrderTruckerSummaryComponent } from './order-trucker-summary.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		LogistOrderServiceModule,
		ContactServiceModule,
		RouterModule.forChild([
			{
				path: '',
				component: OrderTruckerSummaryComponent,
			},
		]),
	],
	declarations: [
		OrderTruckerSummaryComponent,
	],
})
export class OrderTruckerSummaryModule {
}
