import { NgModule } from '@angular/core';
import { OrderContainersSelectorService } from './order-containers-selector/order-containers-selector.service';
import { ShippingPointsSelectorModule } from './shipping-points-selector';
import { ShippingPointsSelectorService } from './shipping-points-selector/shipping-points-selector.service';

@NgModule({
  imports: [ShippingPointsSelectorModule],
  providers: [ShippingPointsSelectorService, OrderContainersSelectorService],
})
export class LogistSelectorsModule {
  // Idea is that we keep all the services together and all the components separately
}
