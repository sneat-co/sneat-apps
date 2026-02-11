import { Component, inject } from '@angular/core';
import {
  IonCard,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
} from '@ionic/angular/standalone';
import { LogistOrderService } from '../../services';
import { OrderPrintPageBaseComponent } from '../order-print-page-base.component';
import { ClassName } from '@sneat/ui';

@Component({
  selector: 'sneat-logist-order-print-shipping-doc',
  templateUrl: './order-expedition-print-doc.component.html',
  imports: [IonCard, IonRow, IonCol, IonItem, IonLabel, IonInput, IonGrid],
  providers: [
    { provide: ClassName, useValue: 'OrderExpeditionPrintDocComponent' },
  ],
})
export class OrderExpeditionPrintDocComponent extends OrderPrintPageBaseComponent {
  public constructor() {
    super(inject(LogistOrderService));
  }
}
