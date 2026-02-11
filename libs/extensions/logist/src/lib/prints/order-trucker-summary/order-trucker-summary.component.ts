import { Component, inject } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonRow,
} from '@ionic/angular/standalone';
import {
  IContainerSegment,
  IFreightLoad,
  ILogistOrderContext,
  IOrderContainer,
  IOrderCounterparty,
  IOrderShippingPoint,
} from '../../dto';
import { LogistOrderService } from '../../services';
import { OrderPrintPageBaseComponent } from '../order-print-page-base.component';
import { ClassName } from '@sneat/ui';

interface IContainerInfo {
  dispatcher?: IOrderCounterparty;
  from?: IOrderShippingPoint;
  toLoad?: IFreightLoad;
  segment?: IContainerSegment;
  container?: IOrderContainer;
}

@Component({
  selector: 'sneat-print-order-trucker-summary',
  templateUrl: './order-trucker-summary.component.html',
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonItemDivider,
  ],
  providers: [{ provide: ClassName, useValue: 'OrderTruckerSummaryComponent' }],
})
export class OrderTruckerSummaryComponent extends OrderPrintPageBaseComponent {
  truckerID?: string;
  truckerCounterparty?: IOrderCounterparty;
  buyerCounterparty?: IOrderCounterparty;
  selfCounterparty?: IOrderCounterparty;
  ship?: IOrderCounterparty;
  shippingLine?: IOrderCounterparty;
  points?: readonly IContainerInfo[];

  buyerRefNumber?: string;

  public constructor() {
    const orderService = inject(LogistOrderService);

    super(orderService);
    this.route.queryParams?.pipe(this.takeUntilDestroyed())?.subscribe({
      next: (params) => {
        this.truckerID = params['truckerID'];
        console.log('truckerID', this.truckerID);
        if (this.order?.dbo) {
          this.setTrucker();
        }
      },
    });
  }

  private setTrucker(): void {
    this.truckerCounterparty = this?.order?.dbo?.counterparties?.find(
      (c) => c.role === 'trucker' && c.contactID === this.truckerID,
    );
  }

  protected override onOrderChanged(order: ILogistOrderContext) {
    super.onOrderChanged(order);
    const counterparties = this.order?.dbo?.counterparties;
    if (this.truckerID) {
      this.setTrucker();
    }

    this.buyerCounterparty = counterparties?.find((c) => c.role === 'buyer');
    this.selfCounterparty = counterparties?.find(
      (c) => c.contactID === this.space?.id,
    );
    this.ship = counterparties?.find((c) => c.role === 'ship');
    this.shippingLine = counterparties?.find((c) => c.role === 'shipping_line');
    this.points = order.dbo?.segments
      ?.filter((s) => s.byContactID === this.truckerID)
      .map((segment) => {
        const container = order?.dbo?.containers?.find(
          (c) => c.id === segment.containerID,
        );
        const toPick = order?.dbo?.containerPoints?.find(
          (p) =>
            p.containerID === segment.containerID &&
            p.shippingPointID === segment.from.shippingPointID,
        )?.toLoad;
        const from = order?.dbo?.shippingPoints?.find(
          (p) => p.id === segment.from.shippingPointID,
        );
        const dispatcher = order?.dbo?.counterparties?.find(
          (c) => c.contactID === from?.counterparty?.contactID,
        );
        const containerInfo: IContainerInfo = {
          container,
          from,
          toLoad: toPick,
          segment,
          dispatcher,
        };
        return containerInfo;
      });
  }
}
