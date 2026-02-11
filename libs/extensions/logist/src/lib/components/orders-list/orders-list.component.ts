import { Component, Input } from '@angular/core';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { ISpaceContext } from '@sneat/space-models';
import { ILogistOrderContext } from '../../dto/order-dto';
import { OrderCardComponent } from '../order-card/order-card.component';

@Component({
  selector: 'sneat-logist-orders-list',
  templateUrl: './orders-list.component.html',
  imports: [OrderCardComponent, IonCard, IonCardContent],
})
export class OrdersListComponent {
  @Input({ required: true }) space?: ISpaceContext;
  @Input() orders?: ILogistOrderContext[];
}
