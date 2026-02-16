import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Output,
  signal,
  inject,
} from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';
import { Numeral2Pipe } from '@sneat/components';
import {
  IHappeningSlot,
  WeekdayCode2,
  IHappeningContext,
  IHappeningSlotWithID,
  WdToWeekdayPipe,
} from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import {
  HappeningService,
  IDeleteSlotRequest,
} from '../../services/happening.service';
import {
  HappeningSlotModalService,
  HappeningSlotModalServiceModule,
} from '../happening-slot-form/happening-slot-modal.service';

export interface AddSlotParams {
  wd?: WeekdayCode2;
}

@Component({
  imports: [
    HappeningSlotModalServiceModule,
    WdToWeekdayPipe,
    Numeral2Pipe,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonText,
    IonBadge,
    IonSpinner,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sneat-happening-slots',
  templateUrl: './happening-slots.component.html',
})
export class HappeningSlotsComponent {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly happeningService = inject(HappeningService);
  private readonly happeningSlotModalService = inject(
    HappeningSlotModalService,
  );

  public readonly happening = input.required<IHappeningContext>();

  public readonly wd = input<WeekdayCode2 | undefined>();

  @Output() readonly slotSelected = new EventEmitter<IHappeningSlot>();
  @Output() readonly happeningChange = new EventEmitter<IHappeningContext>();

  protected readonly $slots = computed<IHappeningSlotWithID[] | undefined>(() =>
    Object.entries(this.happening().brief?.slots || {}).map(([id, slot]) =>
      Object.assign(slot, { id }),
    ),
  );

  protected readonly hasAnyWd = (
    slot: IHappeningSlotWithID,
    ...wds: readonly WeekdayCode2[]
  ) => wds.some((wd) => !!slot.weekdays?.includes(wd));

  protected removeSlot(event: Event, slot: IHappeningSlotWithID): void {
    event.preventDefault();
    event.stopPropagation();
    const happening = this.happening();
    if (!happening.brief) {
      throw new Error('!this.happening?.brief');
    }
    if (happening.id) {
      this.deleteSlot(slot);
    } else {
      this.removeSlotFromHappening(slot);
    }
  }

  private removeSlotFromHappening(slot: IHappeningSlotWithID): void {
    const happening = this.happening();
    if (!happening.brief) {
      throw new Error('!this.happening');
    }
    this.onHappeningChanged({
      ...happening,
      brief: {
        ...happening.brief,
        slots: Object.fromEntries(
          Object.entries(happening.brief?.slots || {}).filter(
            ([id]) => id !== slot.id,
          ),
        ),
      },
    });
  }

  private deleteSlot(slot: IHappeningSlotWithID): void {
    const happening = this.happening();
    if (!happening.brief) {
      throw new Error('!this.happening?.brief');
    }
    const happeningID = happening.id;
    if (!happeningID) {
      throw new Error('!happeningID');
    }
    const spaceID = happening.space.id;
    if (!spaceID) {
      throw new Error('!spaceID');
    }
    const request: IDeleteSlotRequest = {
      spaceID: spaceID,
      happeningID,
      slotID: slot.id,
    };

    this.$deletingSlotIDs.set([...this.$deletingSlotIDs(), slot.id]);

    const removeFromDeletingSlotIDs = (delay: number) =>
      setTimeout(
        () =>
          this.$deletingSlotIDs.set(
            this.$deletingSlotIDs().filter((id) => id !== slot.id),
          ),
        delay,
      );
    this.happeningService.deleteSlot(request).subscribe({
      next: () => {
        this.removeSlotFromHappening(slot);
        removeFromDeletingSlotIDs(0);
      },
      error: (err) => {
        this.errorLogger.logError(err, 'failed to delete slot');
        removeFromDeletingSlotIDs(300);
      },
    });
  }

  protected readonly $deletingSlotIDs = signal<readonly string[]>([]);

  protected selectSlot(event: Event, slot: IHappeningSlotWithID): void {
    this.slotSelected.emit(slot);
    this.showEditSlot(event, slot);
  }

  protected onHappeningChanged(happening: IHappeningContext): void {
    this.happeningChange.emit(happening);
  }

  protected editingSlot?: IHappeningSlot;

  protected showEditSlot(event: Event, slot: IHappeningSlotWithID): void {
    event.stopPropagation();
    event.preventDefault();
    const happening = this.happening();
    this.happeningSlotModalService
      .editSingleHappeningSlot(event, happening, undefined, slot)
      .catch(this.errorLogger.logErrorHandler('failed to open edit modal'));

    // this.addSlotParams = undefined;
    // this.editingSlot = slot;
    // this.isShowingSlotFormModal = true;
  }

  protected showAddSlot(event: Event, _params?: AddSlotParams): void {
    const happening = this.happening();
    this.happeningSlotModalService
      .editSingleHappeningSlot(event, happening)
      .catch(this.errorLogger.logErrorHandler('failed to open edit modal'));

    // this.editingSlot = undefined;
    // this.addSlotParams = params;
    // this.isShowingSlotFormModal = true;
  }

  // onSlotFormModalDismissed(event: Event): void {
  // 	console.log('onAddSlotModalDismissed(), event:', event);
  // 	this.editingSlot = undefined;
  // 	this.isShowingSlotFormModal = false;
  // 	this.addSlotDismissed.next();
  // }
}
