import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { OrderContainersSelectorService } from './order-containers-selector/order-containers-selector.service';
import { ShippingPointsSelectorModule } from './shipping-points-selector';
import { ShippingPointsSelectorService } from './shipping-points-selector/shipping-points-selector.service';

@NgModule({
	imports: [CommonModule, IonicModule, ShippingPointsSelectorModule],
	providers: [ShippingPointsSelectorService, OrderContainersSelectorService],
})
export class LogistSelectorsModule {
	// Idea is that we keep all the services together and all the components separately
}
