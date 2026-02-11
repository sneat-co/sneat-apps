import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {
  CurrencyCode,
  IHappeningBrief,
  IHappeningContext,
  IHappeningPrice,
  TermUnit,
} from '@sneat/mod-schedulus-core';
import { ClassName, SneatBaseModalComponent } from '@sneat/ui';
import {
  HappeningService,
  IHappeningPricesRequest,
} from '../../../services/happening.service';
import { RadioGroupToSelectComponent, SelectOption } from '@sneat/wizard';

@Component({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    IonContent,
    IonList,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    RadioGroupToSelectComponent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonFooter,
  ],
  providers: [{ provide: ClassName, useValue: 'HappeningPriceFormComponent' }],
  selector: 'sneat-happening-price-form',
  templateUrl: 'happening-price-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HappeningPriceModalComponent extends SneatBaseModalComponent {
  protected readonly changeDetectorRef = inject(ChangeDetectorRef);
  protected readonly happeningService = inject(HappeningService);

  @Input({ required: true }) happening?: IHappeningContext;

  @Output() happeningChange = new EventEmitter<IHappeningContext>();

  // @ViewChild('termLengthSelect', { static: false })
  // termLengthSelect?: IonSelect;

  @Output() readonly canceled = new EventEmitter<void>();

  protected isSubmitting = false;

  public constructor() {
    super();
    this.setTermLengths();
  }

  protected readonly priceValue = new FormControl<number | undefined>(
    undefined,
  );

  protected readonly priceCurrency = new FormControl<CurrencyCode | undefined>(
    'EUR',
  );

  protected readonly termLength = new FormControl<number | undefined>(1);
  protected termUnit?: TermUnit;

  protected termPeriods: SelectOption[] = [];

  protected onTermLengthChange(): void {
    // console.log('onTermLengthChange', event);
    this.setTermLengths();
    this.forceSelectOptionsRefresh();
  }

  private forceSelectOptionsRefresh(): void {
    // For some reason, the select options are not refreshed when the ion-select-option changes.
    // this.termLengthSelect?.
    const temUnit = this.termUnit;
    this.termUnit = undefined;
    this.changeDetectorRef.detectChanges();
    this.termUnit = temUnit;
    this.changeDetectorRef.detectChanges();
  }

  private setTermLengths(): void {
    const isPlural = (this.termLength.value || 0) > 1;
    this.termPeriods = [
      { value: 'single', title: 'Single event' },
      { value: 'hour', title: isPlural ? 'Hours' : 'Hour' },
      { value: 'day', title: isPlural ? 'Days' : 'Day' },
      { value: 'week', title: 'Week' },
      { value: 'month', title: 'Month' },
      { value: 'year', title: 'Year' },
    ];
  }

  protected addPrice(event: Event): void {
    console.log('submitAddPrice');
    event.stopPropagation();
    event.preventDefault();

    const termLength: number = this.termLength.value || 0;
    if (!termLength) {
      this.errorLogger.logError('!termLength');
      return;
    }

    const amountValue = (this.priceValue.value || 0) * 100;
    const currency = this.priceCurrency.value || '';

    if (!this.termUnit) {
      this.errorLogger.logError('!termUnit');
      return;
    }

    const price: IHappeningPrice = {
      id: '',
      term: {
        unit: this.termUnit,
        length: termLength,
      },
      amount: {
        value: amountValue,
        currency,
      },
    };

    if (this.happening?.id && this.happening?.space?.id) {
      this.submitPrice(price);
    } else {
      this.addPriceToNewHappening(price);
    }
  }

  private addPriceToNewHappening(price: IHappeningPrice): void {
    price = { ...price, id: `${price.term.unit}${price.term.length}` };

    const pushPrice = <T extends IHappeningBrief>(h: T): T => {
      return { ...h, prices: [...(h.prices || []), price] };
    };
    if (this.happening?.brief) {
      this.happening = {
        ...this.happening,
        brief: pushPrice(this.happening.brief),
      };
    }
    if (this.happening?.dbo) {
      this.happening = {
        ...this.happening,
        dbo: pushPrice(this.happening.dbo),
      };
    }
    this.happeningChange.emit(this.happening);
    this.dismissModal(this.happening);
  }

  private submitPrice(price: IHappeningPrice): void {
    const happeningID = this.happening?.id || '';
    const spaceID = this.happening?.space?.id || '';
    if (!happeningID) {
      this.errorLogger.logError('!happeningID');
      return;
    }
    if (!spaceID) {
      this.errorLogger.logError('!spaceID');
      return;
    }

    const request: IHappeningPricesRequest = {
      spaceID: spaceID,
      happeningID,
      prices: [price],
    };

    this.isSubmitting = true;
    this.happeningService.setHappeningPrices(request).subscribe({
      error: this.errorLogger.logErrorHandler(
        'failed to add price to a happening',
      ),
      complete: () => {
        this.isSubmitting = false;
      },
      next: () => {
        this.dismissModal();
      },
    });
  }
}
