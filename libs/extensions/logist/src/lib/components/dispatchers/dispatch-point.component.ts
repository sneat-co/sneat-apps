import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonRow,
  IonText,
  IonTextarea,
} from '@ionic/angular/standalone';
import { CountryFlagPipe } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import {
  IAddContainerPointsRequest,
  IContainerPoint,
  IContainerSegment,
  ILogistOrderContext,
  IOrderContainer,
  IOrderCounterparty,
  IOrderShippingPoint,
  IOrderShippingPointRequest,
  IUpdateShippingPointRequest,
} from '../../dto';
import { LogistOrderService } from '../../services';
import { OrderContainersSelectorService } from '../order-containers-selector/order-containers-selector.service';
import { DispatchPointContainersGridComponent } from './dispatch-point-containers-grid.component';

@Component({
  selector: 'sneat-dispatch-point',
  templateUrl: './dispatch-point.component.html',
  imports: [
    DispatchPointContainersGridComponent,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
    IonItem,
    IonCol,
    ReactiveFormsModule,
    IonTextarea,
    IonRow,
    IonGrid,
    IonItemDivider,
    IonCard,
    IonText,
    CountryFlagPipe,
  ],
})
export class DispatchPointComponent implements OnChanges {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly orderService = inject(LogistOrderService);
  private readonly containersSelectorService = inject(
    OrderContainersSelectorService,
  );

  @Input() dispatchPoint?: IOrderCounterparty;
  @Input() order?: ILogistOrderContext;
  @Input() disabled = false;

  shippingPoint?: IOrderShippingPoint;
  segments?: readonly IContainerSegment[];
  containerPoints?: readonly IContainerPoint[];
  containers?: readonly IOrderContainer[];
  dispatcher?: IOrderCounterparty;

  @Input() deleting = false;

  notes = new FormControl<string>('');
  address = new FormControl<string>('');

  form = new FormGroup({
    notes: this.notes,
    address: this.address,
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order'] || changes['dispatchPoint']) {
      const orderDto = this.order?.dbo;
      const contactID = this.dispatchPoint?.contactID;
      this.dispatcher = orderDto?.counterparties?.find(
        (c) => c.contactID === contactID && c.role === 'dispatcher',
      );
      this.shippingPoint = orderDto?.shippingPoints?.find(
        (sp) => sp.location?.contactID === contactID,
      );
      if (!this.address.dirty) {
        this.address.setValue(
          this.shippingPoint?.location?.address?.lines || '',
        );
      }
      const shippingPointID = this.shippingPoint?.id;
      this.containerPoints = orderDto?.containerPoints?.filter(
        (cp) => cp.shippingPointID === shippingPointID,
      );
      this.segments = this.order?.dbo?.segments?.filter(
        (s) =>
          s.from.shippingPointID === shippingPointID ||
          s.to.shippingPointID === shippingPointID,
      );
      this.containers = this.order?.dbo?.containers?.filter(
        (c) =>
          this.segments?.some((s) => s.containerID === c.id) ||
          this.containerPoints?.some((cp) => cp.containerID === c.id),
      );
      console.log(
        'DispatchPointComponent.ngOnChanges();',
        shippingPointID,
        this.segments,
        this.containers,
      );
    }
  }

  assignContainers(event: Event): void {
    event.stopPropagation();
    this.containersSelectorService
      .selectOrderContainersInModal(this.order)
      .then((containers) => {
        const order = this.order;
        if (!order?.space?.id) {
          return;
        }
        const shippingPointID = this.shippingPoint?.id;
        if (!shippingPointID) {
          return;
        }
        if (!containers?.length) {
          return;
        }
        const request: IAddContainerPointsRequest = {
          spaceID: order.space.id,
          orderID: order.id,
          containerPoints: containers?.map((c) => ({
            containerID: c.id,
            shippingPointID,
            tasks: c.tasks || [],
            status: 'pending',
          })),
        };
        this.orderService.addContainerPoints(request).subscribe({
          error: this.errorLogger.logErrorHandler(
            'Failed to add container points',
          ),
        });
      });
  }

  savePoint(event: Event): void {
    event.stopPropagation();
    const order = this.order,
      shippingPoint = this.shippingPoint;
    if (!order || !shippingPoint) {
      return;
    }
    const request: IUpdateShippingPointRequest = {
      spaceID: order.space.id,
      orderID: order.id,
      shippingPointID: shippingPoint.id,
      setStrings: { notes: this.notes.value?.trim() || '' },
    };
    this.orderService.updateShippingPoint(request).subscribe({
      error: this.errorLogger.logErrorHandler(
        'Failed to update shipping point',
      ),
    });
  }

  deletePoint(): void {
    if (!this.order || !this.shippingPoint) {
      return;
    }
    if (this.shippingPoint) {
      const request: IOrderShippingPointRequest = {
        spaceID: this.order.space.id,
        orderID: this.order.id,
        shippingPointID: this.shippingPoint.id,
      };
      this.deleting = true;
      this.orderService.deleteShippingPoint(request).subscribe({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        next: () => {},
        error: (err) => {
          this.errorLogger.logError(err, 'Failed to delete shipping point');
          this.deleting = false;
        },
      });
    }
  }
}
