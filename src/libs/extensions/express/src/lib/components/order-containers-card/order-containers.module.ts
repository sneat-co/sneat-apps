import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DialogHeaderModule, SelectFromListModule } from '@sneat/components';
import { NewContainerComponent } from '../new-container/new-container.component';
import {
	ShippingPointsSelectorModule
} from '../shipping-points-selector/shipping-points-selector.module';
import { ContainerFormComponent } from './container-form.component';
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
  ],
	declarations: [
		ContainerFormComponent,
		OrderContainersComponent,
		NewContainerComponent,
	],
	exports: [
		OrderContainersComponent,
	],
})
export class OrderContainersModule {

}
