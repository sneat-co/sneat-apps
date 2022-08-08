import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { DispatchersModule } from '../../components/dispatchers';
import { NewSegmentModule } from '../../components/new-segment';
import { OrderContainersModule } from '../../components/order-containers-card';
import { OrderFormModule } from '../../components/order-form.module';
import { OrderSegmentsComponent } from '../../components/order-segments/order-segments.component';
import { OrderTruckerComponent } from '../../components/order-truckers/order-trucker.component';
import { OrderTruckersComponent } from '../../components/order-truckers/order-truckers.component';
import { SegmentContainerComponent } from '../../components/order-truckers/segment-container.component';
import { TruckerSegmentComponent } from '../../components/order-truckers/trucker-segment.component';
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
    SneatPipesModule,
    ReactiveFormsModule,
  ],
	declarations: [
		ExpressOrderPageComponent,
		OrderSegmentsComponent,
		OrderTruckersComponent,
		OrderTruckerComponent,
		TruckerSegmentComponent,
		SegmentContainerComponent,
	],
})
export class ExpressOrderPageModule {
}
