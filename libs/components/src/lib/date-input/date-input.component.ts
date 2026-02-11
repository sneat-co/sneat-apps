import {
  Component,
  computed,
  inject,
  input,
  Output,
  EventEmitter,
  signal,
} from '@angular/core';
import {
  IonInput,
  IonLabel,
  IonButton,
  IonButtons,
  IonItem,
  PopoverController,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { DateModalComponent } from './date-modal.component';

@Component({
  selector: 'sneat-date-input',
  templateUrl: 'date-input.component.html',
  imports: [
    IonItem,
    IonInput,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
  providers: [PopoverController],
})
export class DateInputComponent {
  public readonly $label = input.required<string>();
  public readonly $value = input.required<string | undefined>();
  public readonly $max = input<string>();

  public readonly $newValue = signal<string | undefined>(undefined);

  public readonly $displayValue = computed(() =>
    this.$updating() ? this.$newValue() : this.$value(),
  );

  public readonly $updating = input<boolean>();

  @Output() public valueChange = new EventEmitter<string | undefined>();

  public readonly $noValueLabel = input<string>();

  protected readonly $noValueText = computed(
    () => this.$noValueLabel() || '(not set)',
  );

  protected readonly $noValueButtonColor = input<string>();

  protected readonly popoverCtrl = inject(PopoverController);

  protected onValueChanged(event: CustomEvent): void {
    const newValue = event.detail.value as string;
    console.log('onValueChanged', newValue);
    this.$newValue.set(newValue);
  }

  protected save(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.valueChange.emit(this.$newValue());
  }

  protected async openDatePicker(event: Event): Promise<void> {
    event.stopPropagation();
    event.preventDefault();
    const popover = await this.popoverCtrl.create({
      reference: 'trigger',
      event,
      side: 'bottom',
      alignment: 'center',
      component: DateModalComponent,
      componentProps: {
        title: this.$label(),
        max: this.$max(),
      },
    });
    popover.onDidDismiss().then((eventDetail) => {
      // console.log(`Selected "${this.$label()}":`, eventDetail.data);
      const value = eventDetail.data as string | undefined;
      if (value !== undefined) {
        this.$newValue.set(value || '');
        this.valueChange.emit(eventDetail.data as string | undefined);
      }
    });
    await popover.present();
  }
}
