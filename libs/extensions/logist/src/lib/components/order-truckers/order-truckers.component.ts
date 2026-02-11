import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IonCard, IonItemDivider, IonLabel } from '@ionic/angular/standalone';
import { ISpaceContext } from '@sneat/space-models';
import { ILogistOrderContext, IOrderCounterparty } from '../../dto';
import { OrderTruckerComponent } from './order-trucker.component';

@Component({
  selector: 'sneat-order-truckers',
  templateUrl: './order-truckers.component.html',
  imports: [IonCard, IonItemDivider, IonLabel, OrderTruckerComponent],
})
export class OrderTruckersComponent implements OnChanges {
  @Input({ required: true }) space?: ISpaceContext;
  @Input() order?: ILogistOrderContext;

  public truckers?: readonly IOrderCounterparty[];
  hasUnassignedSegments = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order']) {
      this.truckers = this.order?.dbo?.counterparties?.filter(
        (c) => c.role === 'trucker',
      );
      this.hasUnassignedSegments = !!this?.order?.dbo?.segments?.some(
        (s) => !s.byContactID,
      );
    }
  }
}
