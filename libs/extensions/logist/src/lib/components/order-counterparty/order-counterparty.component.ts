import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ToastController,
  IonButton,
  IonButtons,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonRow,
  IonSpinner,
} from '@ionic/angular/standalone';
import { LogistOrderContactRole, ContactType } from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import { CounterpartyRole } from '../../dto';
import {
  ILogistOrderContext,
  IOrderCounterparty,
  ISetOrderCounterpartiesRequest,
} from '../../dto/order-dto';
import { LogistOrderService } from '../../services';
import { OrderCounterpartyInputComponent } from '../order-counterparty-input/order-counterparty-input.component';

@Component({
  selector: 'sneat-logist-order-counterparty',
  templateUrl: './order-counterparty.component.html',
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    OrderCounterpartyInputComponent,
    IonButtons,
    IonButton,
    IonInput,
    IonItem,
    IonIcon,
    IonSpinner,
    FormsModule,
  ],
})
export class OrderCounterpartyComponent implements OnChanges {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly orderService = inject(LogistOrderService);
  private readonly toastController = inject(ToastController);

  @Input() labelPosition?: 'fixed' | 'stacked' | 'floating';
  @Input() readonly = false;
  @Input() useColumns = true;
  @Input({ required: true }) space?: ISpaceContext;
  @Input() refNumLabel = 'Ref #';

  @Input() label?: string = undefined;

  @Input() canChangeContact = true;
  @Input() counterpartyRole?: CounterpartyRole;
  @Input() contactType: ContactType = 'company';
  @Input() contactRole?: LogistOrderContactRole;

  // We do not need parent contact type as for now it's always 'company' in logist order
  @Input() parentRole?: LogistOrderContactRole;
  @Input() parentType: ContactType = 'company';

  @Input() selectOnly = false;
  @Input() order?: ILogistOrderContext;
  @Output() readonly orderChange = new EventEmitter<ILogistOrderContext>();

  counterparty?: IOrderCounterparty;
  @Output() readonly counterpartyChange =
    new EventEmitter<IOrderCounterparty>();

  refNumber = '';

  isRefNumberChanged = false;

  savingRefNumber = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['order'] ||
      (changes['counterpartyRole'] && this.order && this.counterpartyRole)
    ) {
      this.counterparty = this.order?.dbo?.counterparties?.find(
        (c) => c.role === this.counterpartyRole,
      );
      if (!this.isRefNumberChanged) {
        this.refNumber = this.counterparty?.refNumber || '';
      }
    }
  }

  protected onOrderChanged(order: ILogistOrderContext): void {
    this.setAndEmitOrder(order);
  }

  private setAndEmitOrder(order: ILogistOrderContext): void {
    this.order = order;
    this.orderChange.emit(order);
  }

  protected onRefNumberChanged(event: Event): void {
    this.isRefNumberChanged =
      (this.counterparty?.refNumber || '') !== this.refNumber;
    if (this.counterparty) {
      this.counterparty = {
        ...this.counterparty,
        refNumber: this.refNumber,
      };
      if (this.order?.dbo) {
        const i = this.order.dbo?.counterparties?.findIndex(
          (c) => c.role === this.counterpartyRole,
        );
        this.order = {
          ...this.order,
          dbo: {
            ...this.order.dbo,
            counterparties:
              i !== undefined && i >= 0 && this.order.dbo?.counterparties
                ? [
                    ...this.order.dbo.counterparties.slice(0, i),
                    this.counterparty,
                    ...this.order.dbo.counterparties.slice(i + 1),
                  ]
                : [...(this.order.dbo.counterparties || []), this.counterparty],
          },
        };
      }
    }
  }

  protected saveRefNumber(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (!this.isRefNumberChanged) {
      return;
    }
    if (!this.space) {
      console.error('saveRefNumber(): !this.team');
      return;
    }
    if (!this.counterpartyRole) {
      this.errorLogger.logError('saveRefNumber(): !this.counterpartyRole');
      return;
    }
    if (!this.order?.id) {
      this.errorLogger.logError('saveRefNumber(): !this.order.id');
      return;
    }
    if (!this.counterparty?.contactID) {
      this.errorLogger.logError(
        'saveRefNumber(): !this.counterparty.contactID',
      );
      return;
    }
    const request: ISetOrderCounterpartiesRequest = {
      spaceID: this.space?.id,
      orderID: this.order?.id,
      counterparties: [
        {
          role: this.counterpartyRole,
          contactID: this.counterparty?.contactID,
          refNumber: this.refNumber || ' ',
        },
      ],
    };
    this.savingRefNumber = true;
    this.orderService.setOrderCounterparties(request).subscribe({
      next: (/*counterparty*/) => {
        // console.log("saveRefNumber(): counterparty:", counterparty);
        // this.counterparty = counterparty;
        this.savingRefNumber = false;
        this.isRefNumberChanged = false;
      },
      error: (err) => {
        this.savingRefNumber = false;
        this.errorLogger.logError(err, 'Failed to save reference number');
      },
    });
  }

  protected cancelRefNumberChanges(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.refNumber = this.counterparty?.refNumber || '';
    this.isRefNumberChanged = false;
  }

  protected copyRefNumberToClipboard(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    const text = this.refNumber;
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.toastController
            .create({
              message: 'Reference number copied to clipboard: ' + text,
              duration: 1500,
            })
            .then((toast) => toast.present());
        })
        .catch((err) =>
          alert('Error copying order number to clipboard: ' + err),
        );
    }
  }
}
