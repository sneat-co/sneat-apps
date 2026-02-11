import { Component, inject } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ClassName } from '@sneat/ui';
import { LogistOrderService } from '../../services';
import { OrderPageBaseComponent } from '../order-page-base.component';

@Component({
  selector: 'sneat-logist-new-shipping-point',
  templateUrl: './new-shipping-point-page.component.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
  ],
  providers: [
    { provide: ClassName, useValue: 'NewShippingPointPageComponent' },
  ],
})
export class NewShippingPointPageComponent extends OrderPageBaseComponent {
  constructor() {
    const orderService = inject(LogistOrderService);

    super(orderService);
  }
}
