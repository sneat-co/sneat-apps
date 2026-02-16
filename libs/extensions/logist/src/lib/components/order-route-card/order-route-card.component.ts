import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
} from '@ionic/angular/standalone';
import { ILogistOrderContext, ITransitPoint } from '../../dto';
import { TransitPointItemComponent } from './transit-point-item.component';

@Component({
  selector: 'sneat-order-route-card',
  templateUrl: './order-route-card.component.html',
  imports: [
    IonCard,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    TransitPointItemComponent,
  ],
})
export class OrderRouteCardComponent {
  @Input() order: ILogistOrderContext = { id: '', space: { id: '' } };
  @Output() orderChange = new EventEmitter<ILogistOrderContext>();

  protected addTransitPoint(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    alert('Not implemented yet');
  }

  onTransitPointChanged(point: ITransitPoint): void {
    // console.log('OrderRouteCardComponent.onTransitPointChanged()', point);
    let order = this.order;
    if (!order?.dbo) {
      return;
    }
    let route = order?.dbo?.route || {};
    switch (point.id) {
      case 'origin':
        route = { ...route, origin: point };
        break;
      case 'destination':
        route = { ...route, destination: point };
        break;
    }
    order = { ...order, dbo: { ...order.dbo, route } };
    this.orderChange.emit(order);
  }
}
