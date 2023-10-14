import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LogistOrderServiceModule } from '../../services';
import { OrderExpeditionPrintDocComponent } from './order-expedition-print-doc.component';

const routes: Routes = [
	{
		path: '',
		component: OrderExpeditionPrintDocComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
		LogistOrderServiceModule,
	],
	declarations: [
		OrderExpeditionPrintDocComponent,
	],
})
export class OrderExpeditionPrintDocModule {

}
