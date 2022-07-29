import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DispatchersModule } from '@sneat/extensions/express';
import { NewSegmentModule } from '../../components/new-segment';
import { OrderContainersModule } from '../../components/order-containers-card';
import { OrderFormModule } from '../../components/order-form.module';
import { OrderSegmentsComponent } from '../../components/order-segments/order-segments.component';
import { OrderTruckersComponent } from '../../components/order-truckers/order-truckers.component';
import { ExpressOrderPageComponent } from './express-order-page.component';

const routes: Routes = [
	{
		path: '',
		component: ExpressOrderPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
		FormsModule,
		OrderFormModule,
		OrderContainersModule,
		NewSegmentModule,
		DispatchersModule,
	],
	declarations: [
		ExpressOrderPageComponent,
		OrderSegmentsComponent,
		OrderTruckersComponent,
	],
})
export class ExpressOrderPageModule {
}
