import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTextarea,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import {
  ContainerPointStringField,
  IContainerPoint,
  ILogistOrderContext,
  IOrderShippingPoint,
  ISetContainerPointFieldsRequest,
} from '../../dto';
import { LogistOrderService } from '../../services';
import { ContainerEndpointComponent } from './container-endpoint.component';
import { ContainerPointLoadFormComponent } from './container-point-load-form.component';

@Component({
  selector: 'sneat-order-container-point',
  templateUrl: './order-container-point.component.html',
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonInput,
    ReactiveFormsModule,
    IonButtons,
    IonButton,
    IonIcon,
    IonSegmentButton,
    IonSegment,
    FormsModule,
    IonSpinner,
    ContainerEndpointComponent,
    ContainerPointLoadFormComponent,
    IonItemGroup,
    IonItemDivider,
    IonTextarea,
  ],
})
export class OrderContainerPointComponent implements OnChanges {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly orderService = inject(LogistOrderService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  @Input({ required: true }) space?: ISpaceContext;
  @Input() order?: ILogistOrderContext;
  // @Input() shippingPoint?: IOrderShippingPoint;
  @Input() containerPoint?: IContainerPoint;

  protected dateTimeTab: 'scheduled' | 'actual' = 'scheduled';

  protected shippingPoint?: IOrderShippingPoint;

  protected readonly notes = new FormControl<string>('');
  protected readonly refNumber = new FormControl<string>('');

  protected deleting = false;
  protected saving = false;

  get showNotes(): boolean {
    return (this.dateTimeTab as string) === 'notes';
  }

  cancelRefNumberChanges(): void {
    this.refNumber.setValue(this.containerPoint?.refNumber || '');
    this.refNumber.markAsPristine();
  }

  cancelNotesChanges(): void {
    this.notes.setValue(this.containerPoint?.notes || '');
    this.notes.markAsPristine();
  }

  onSpecialInstructionsChanged(): void {
    if (this.notes.value === (this.containerPoint?.notes || '')) {
      this.notes.markAsPristine();
    }
  }

  saveRefNumber(event?: Event): void {
    this.saveField('refNumber', this.refNumber, event);
  }

  saveNotes(event?: Event): void {
    this.saveField('notes', this.notes, event);
  }

  saveField(
    name: ContainerPointStringField,
    formControl: FormControl<string | null>,
    event?: Event,
  ): void {
    event?.preventDefault();
    event?.stopPropagation();
    const spaceID = this.space?.id,
      orderID = this.order?.id,
      containerID = this.containerPoint?.containerID,
      shippingPointID = this.containerPoint?.shippingPointID;
    if (!spaceID || !orderID || !containerID || !shippingPointID) {
      return;
    }
    const request: ISetContainerPointFieldsRequest = {
      spaceID: spaceID,
      orderID,
      containerID,
      shippingPointID,
      setStrings: { [name]: formControl.value?.trim() || '' },
    };
    this.saving = true;
    const complete = () => {
      this.saving = false;
      this.changeDetector.markForCheck();
    };
    this.orderService.setContainerPointFields(request).subscribe({
      next: () => {
        this.notes.markAsPristine();
        complete();
      },
      error: (err) => {
        this.errorLogger.logError(err, `Failed to save [${name}]`);
        complete();
      },
      // complete, // TODO: does not work for some reason - needs to be fixed
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['containerPoint'] || changes['order']) {
      this.shippingPoint = this.containerPoint?.shippingPointID
        ? this.order?.dbo?.shippingPoints?.find(
            (sp) => sp.id === this.containerPoint?.shippingPointID,
          )
        : undefined;
      if (this.containerPoint) {
        if (!this.notes.dirty) {
          this.notes.setValue(this.containerPoint.notes || '');
        }
        if (!this.refNumber.dirty) {
          this.refNumber.setValue(this.containerPoint.refNumber || '');
        }
      }
    }
  }

  delete(event: Event): void {
    console.log('ContainerPointComponent.delete()', event);
    const spaceID = this.space?.id;
    if (!spaceID) {
      throw new Error(
        'ContainerPointComponent.delete(): spaceID is not defined',
      );
    }
    const orderID = this.order?.id;
    if (!orderID) {
      throw new Error(
        'ContainerPointComponent.delete(): orderID is not defined',
      );
    }
    const containerID = this.containerPoint?.containerID;
    if (!containerID) {
      throw new Error(
        'ContainerPointComponent.delete(): containerPoint is not defined',
      );
    }
    const shippingPointID = this.containerPoint?.shippingPointID;
    if (!shippingPointID) {
      throw new Error(
        'ContainerPointComponent.delete(): shippingPointID is not defined',
      );
    }
    this.deleting = true;
    this.orderService
      .deleteContainerPoints({
        spaceID: spaceID,
        orderID,
        containerID,
        shippingPointIDs: [shippingPointID],
      })
      .subscribe({
        complete: () => {
          this.deleting = false;
        },
        error: this.errorLogger.logErrorHandler(
          'Failed to delete container point',
        ),
      });
  }
}
