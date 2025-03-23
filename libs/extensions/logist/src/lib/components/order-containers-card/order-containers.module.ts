import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DialogHeaderComponent, SelectFromListModule } from '@sneat/components';
import { DataGridComponent } from '@sneat/datagrid';
import { ContactInputComponent } from '@sneat/contactus-shared';
import { FreightLoadFormModule } from '../freight-load-form/freight-load-form.module';
import { LogistSelectorsModule } from '../logist-selectors.module';
import { NewContainerComponent } from '../new-container/new-container.component';
import { OrderContainersGridModule } from '../order-containers-grid/order-containers-grid.module';
import { OrderFormModule } from '../order-form.module';
import { ShippingPointsSelectorModule } from '../shipping-points-selector';
import { ContainerEndpointComponent } from './container-endpoint.component';
import { ContainerPointLoadFormComponent } from './container-point-load-form.component';
import { ContainerSegmentsComponent } from './container-segments.component';
import { OrderContainerComponent } from './order-container.component';
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
		DataGridComponent,
		ShippingPointsSelectorModule,
		DialogHeaderComponent,
		FreightLoadFormModule,
		OrderContainersGridModule,
		LogistSelectorsModule,
		OrderFormModule,
		ContactInputComponent,
		RouterModule,
	],
	declarations: [
		OrderContainerComponent,
		OrderContainersComponent,
		NewContainerComponent,
		ContainerSegmentComponent,
		OrderContainerPointComponent,
		ContainerSegmentsComponent,
		ContainerPointLoadFormComponent,
		ContainerEndpointComponent,
	],
	exports: [OrderContainersComponent],
})
export class OrderContainersModule {}
