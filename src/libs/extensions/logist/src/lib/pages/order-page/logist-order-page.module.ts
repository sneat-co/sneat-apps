import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { NewShippingPointModule } from '../../components/new-shipping-point/new-shipping-point.module';
import { DispatchersModule } from '../../components/dispatchers';
import { FreightLoadFormModule } from '../../components/freight-load-form/freight-load-form.module';
import { NewSegmentModule } from '../../components/new-segment';
import { OrderContainersModule } from '../../components/order-containers-card';
import { OrderFormModule } from '../../components/order-form.module';
import { OrderSegmentsComponent } from '../../components/order-segments/order-segments.component';
import { OrderTruckerComponent } from '../../components/order-truckers/order-trucker.component';
import { OrderTruckersComponent } from '../../components/order-truckers/order-truckers.component';
import { SegmentContainerComponent } from '../../components/order-truckers/segment-container.component';
import { TruckerSegmentComponent } from '../../components/order-truckers/trucker-segment.component';
import { OrderPrintServiceModule } from '../../prints/order-print-service.module';
import { LogistOrderPageComponent } from './logist-order-page.component';

const routes: Routes = [
	{
		path: '',
		component: LogistOrderPageComponent,
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
		NewShippingPointModule,
		DispatchersModule,
		SneatPipesModule,
		ReactiveFormsModule,
		OrderPrintServiceModule,
		FreightLoadFormModule,
	],
	declarations: [
		LogistOrderPageComponent,
		OrderSegmentsComponent,
		OrderTruckersComponent,
		OrderTruckerComponent,
		TruckerSegmentComponent,
		SegmentContainerComponent,
	],
})
export class LogistOrderPageModule {
}
