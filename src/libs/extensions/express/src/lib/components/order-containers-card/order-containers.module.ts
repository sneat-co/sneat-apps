import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DialogHeaderModule, SelectFromListModule } from '@sneat/components';
import { FreightLoadFormModule } from '../freight-load-form/freight-load-form.module';
import { NewContainerComponent } from '../new-container/new-container.component';
import { OrderContainersGridModule } from '../order-containers-grid/order-containers-grid.module';
import {
	ShippingPointsSelectorModule,
} from '../shipping-points-selector/shipping-points-selector.module';
import { ContainerFormComponent } from './container-form.component';
import { OrderContainerPointComponent } from './order-container-point.component';
import { ContainerSegmentComponent } from './container-segment.component';
import { OrderContainersComponent } from './order-containers.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		SelectFromListModule,
		ReactiveFormsModule,
		ShippingPointsSelectorModule,
		DialogHeaderModule,
		FreightLoadFormModule,
		OrderContainersGridModule,
	],
	declarations: [
		ContainerFormComponent,
		OrderContainersComponent,
		NewContainerComponent,
		ContainerSegmentComponent,
		OrderContainerPointComponent,
	],
	exports: [
		OrderContainersComponent,
		ContainerFormComponent,
		OrderContainerPointComponent,
	],
})
export class OrderContainersModule {

}
