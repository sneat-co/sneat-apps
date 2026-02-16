import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  signal,
} from '@angular/core';
import {
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonSpinner,
  IonText,
  PopoverController,
} from '@ionic/angular/standalone';
import {
  addSpace,
  IContactusSpaceDboAndID,
  IContactWithBrief,
} from '@sneat/contactus-core';
import { excludeUndefined } from '@sneat/core';
import { hasRelated } from '@sneat/dto';
import { WithSpaceInput } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { CalendarNavServicesModule } from '../../../../services';
import {
  HappeningUIState,
  IHappeningContext,
  HappeningStatus,
} from '@sneat/mod-schedulus-core';
import { ISlotUIContext } from '@sneat/mod-schedulus-core';
import {
  ContactsSelectorModule,
  ContactsSelectorService,
  IContactSelectorOptions,
} from '@sneat/contactus-shared';
import { ISpaceContext, zipMapBriefsWithIDs } from '@sneat/space-models';
import { NEVER, Observable } from 'rxjs';
import {
  EditRecurringSlotParams,
  HappeningSlotModalService,
  HappeningSlotModalServiceModule,
} from '../../../happening-slot-form/happening-slot-modal.service';
import {
  HappeningService,
  HappeningServiceModule,
  ICancelHappeningRequest,
  IDeleteSlotRequest,
  IHappeningContactRequest,
  ISlotRefRequest,
  ISlotRequest,
} from '../../../../services/happening.service';
import { DaySlotItemComponent } from './day-slot-item.component';

const notImplemented = 'Sorry, not implemented yet';

@Component({
  imports: [
    HappeningServiceModule,
    ContactsSelectorModule,
    HappeningSlotModalServiceModule,
    CalendarNavServicesModule,
    DaySlotItemComponent,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonItem,
    IonSpinner,
    IonText,
    IonIcon,
  ],
  providers: [{ provide: ClassName, useValue: 'SlotContextMenuComponent' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sneat-slot-context-menu',
  templateUrl: 'slot-context-menu.component.html',
})
export class SlotContextMenuComponent extends WithSpaceInput {
  @Input({ required: true }) contactusSpace?: IContactusSpaceDboAndID;

  @Input() dateID?: string;
  @Input() public slotContext?: ISlotUIContext;

  // protected readonly happening = signal<IHappeningContext | undefined>(
  // 	undefined,
  // );

  protected readonly $happeningState = signal<HappeningUIState | undefined>(
    undefined,
  );

  public get isCancelled(): boolean {
    return (
      this.slotContext?.happening.brief?.status === 'canceled' ||
      !!this.slotContext?.adjustment?.canceled
    );
  }

  protected readonly $disabled = computed(() => !!this.$happeningState());

  private readonly popoverController = inject(PopoverController);
  private readonly happeningService = inject(HappeningService);
  private readonly contactsSelectorService = inject(ContactsSelectorService);
  private readonly happeningSlotModalService = inject(
    HappeningSlotModalService,
  );

  public constructor() {
    super();
  }

  protected assign(event: Event, _target?: 'member'): void {
    event.stopPropagation();
    event.preventDefault();
    const space = this.$space();
    if (!space || !this.slotContext) {
      return;
    }
    const contacts =
      zipMapBriefsWithIDs(this.contactusSpace?.dbo?.contacts)?.map(
        addSpace(space),
      ) || [];
    const happening = this.slotContext.happening;
    const selectedContacts = contacts
      .filter((m) =>
        hasRelated(happening?.dbo?.related || happening?.brief?.related, {
          module: 'contactus',
          collection: 'contacts',
          spaceID: space.id || '',
          itemID: m.id,
        }),
      )
      .map(addSpace(space));
    const options: IContactSelectorOptions = {
      // items: from(contacts),
      selectedItems: selectedContacts,
      onAdded: this.onContactAdded,
      onRemoved: this.onContactRemoved,
    };
    this.popoverController.dismiss().catch(console.error);
    this.contactsSelectorService.selectMultipleContacts(options);
  }

  protected move(): void {
    this.notImplemented();
  }

  protected cancelAdjustment(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    const dateID = this.dateID;
    if (!dateID) {
      return;
    }
    const slot = this.slotContext?.slot;
    if (!slot) {
      return;
    }
    const happeningID = this.slotContext?.happening?.id;
    if (!happeningID) {
      return;
    }

    this.$happeningState.set('cancelling-adjustment');
    this.happeningService
      .cancelAdjustment(this.$spaceID(), happeningID, slot.id, dateID)
      .subscribe({
        next: () => this.dismissPopover(),
        error: (err) => {
          this.errorLogger.logError(
            err,
            'Failed to cancel happening slot adjustment',
          );
          this.$happeningState.set(undefined);
        },
      });
  }

  protected edit(event: Event, editMode: 'series' | 'single'): void {
    const happening = this.slotContext?.happening;
    if (!happening) {
      return;
    }
    if (!this.$space()) {
      return;
    }
    const recurring: EditRecurringSlotParams | undefined = this.dateID
      ? {
          dateID: this.dateID,
          adjustment: this.slotContext?.adjustment,
          editMode,
        }
      : undefined;
    this.happeningSlotModalService
      .editSingleHappeningSlot(
        event,
        { ...happening, space: this.$space() },
        recurring,
        this.slotContext?.slot,
      )
      .catch(
        this.errorLogger.logErrorHandler(
          'Failed in editing single happening slot',
        ),
      );
    this.dismissPopover();
  }

  delete(event: Event): void {
    const slot = this.slotContext;
    if (!slot) {
      return;
    }
    if (this.slotContext?.repeats === 'weekly' && !slot.wd) {
      throw new Error('this.slot?.repeats === "weekly" && !slot.wd');
    }
    const request = this.createDeleteSlotRequest(event);
    this.$happeningState.set('deleting');
    this.happeningService.deleteSlot(request).subscribe({
      next: () => {
        this.$happeningState.set('deleted');
        this.dismissPopover();
      },
      error: (err) => {
        setTimeout(() => {
          this.$happeningState.set(undefined);
          this.errorLogger.logError(
            err,
            'Failed to delete happening from context menu',
          );
        }, 2000);
      },
    });
  }

  private dismissPopover(): void {
    this.popoverController.dismiss().catch(
      this.errorLogger.logErrorHandler('Failed to dismiss popover', {
        show: false,
        feedback: false,
      }),
    );
  }

  archive(): void {
    this.notImplemented();
  }

  private stopEvent(event: Event): {
    slotContext: ISlotUIContext;
    happening: IHappeningContext;
    space: ISpaceContext;
  } {
    if (!this.$space()) {
      throw new Error('!this.$space()');
    }
    if (!this.slotContext) {
      throw new Error('!this.slot');
    }
    event.stopPropagation();
    event.preventDefault();
    return {
      space: this.$space(),
      slotContext: this.slotContext,
      happening: this.slotContext.happening,
    };
  }

  private createSlotRefRequest(event: Event): ISlotRefRequest {
    const { slotContext, space, happening } = this.stopEvent(event);
    return {
      spaceID: space.id,
      happeningID: happening.id,
      slotID: slotContext.slot.id,
    };
  }

  private createSlotRequest(
    event: Event,
    mode: 'whole' | 'slot',
  ): ISlotRequest {
    const { slotContext, space, happening } = this.stopEvent(event);
    // const slotsCount = happening.brief?.slots?.length || happening.dto?.slots?.length || 0;
    const request: ISlotRequest = excludeUndefined({
      spaceID: space.id,
      happeningID: happening.id,
      slotID: mode === 'slot' ? slotContext.slot.id : undefined,
      weekday: mode === 'slot' ? slotContext.wd : undefined,
      date:
        mode === 'slot' && happening.brief?.type === 'recurring'
          ? this.dateID
          : undefined,
    });
    return request;
  }

  private createDeleteSlotRequest(event: Event): IDeleteSlotRequest {
    return this.createSlotRefRequest(event);
  }

  createCancellationRequest(
    event: Event,
    mode: 'whole' | 'slot',
  ): ICancelHappeningRequest {
    return this.createSlotRequest(event, mode);
  }

  private setHappeningStatus(status: HappeningStatus): void {
    if (!this.slotContext) {
      return;
    }
    let happening = this.slotContext.happening;
    if (happening.brief) {
      happening = {
        ...happening,
        brief: { ...happening.brief, status },
      };
    }
    if (happening.dbo) {
      happening = {
        ...happening,
        dbo: { ...happening.dbo, status },
      };
    }
    this.slotContext = {
      ...this.slotContext,
      happening,
    };
  }

  revokeCancellation(event: Event): void {
    this.$happeningState.set('revoking-cancellation');
    if (!this.slotContext) {
      return;
    }
    const mode: 'whole' | 'slot' =
      this.slotContext.happening.brief?.status === 'canceled'
        ? 'whole'
        : 'slot';
    const request = this.createCancellationRequest(event, mode);
    this.happeningService.revokeHappeningCancellation(request).subscribe({
      next: () => {
        this.$happeningState.set(undefined);
        this.setHappeningStatus('active');
        this.dismissPopover();
      },
      error: (err) => {
        setTimeout(() => {
          this.$happeningState.set(undefined);
          this.errorLogger.logError(
            err,
            'Failed to delete happening from context menu',
          );
        }, 2000);
      },
    });
  }

  markCanceled(event: Event, mode: 'whole' | 'slot'): void {
    this.$happeningState.set(
      mode == 'slot' ? 'cancelling-single' : 'cancelling-series',
    );
    const request = this.createCancellationRequest(event, mode);
    this.happeningService.cancelHappening(request).subscribe({
      next: () => {
        this.$happeningState.set('canceled');
        this.setHappeningStatus('canceled');
        this.dismissPopover();
      },
      error: (err) => {
        setTimeout(() => {
          this.$happeningState.set(undefined);
          this.errorLogger.logError(
            err,
            'Failed to delete happening from context menu',
          );
        }, 2000);
      },
    });
  }

  notImplemented(): void {
    this.dismissPopover();
    setTimeout(() => alert(notImplemented), 100);
  }

  numberOfSlots(happening?: IHappeningContext): number {
    let n = 0;
    if (!happening) {
      return n;
    }
    const brief = happening?.brief;
    if (!brief) {
      return n;
    }
    const slots = brief.slots;
    if (!slots) {
      return n;
    }
    Object.values(slots).forEach((slot) => {
      slot.weekdays?.forEach(() => n++);
    });
    return n;
  }

  private readonly onContactAdded = (
    contact: IContactWithBrief,
  ): Observable<void> => {
    if (!this.slotContext) {
      return NEVER;
    }
    if (!this.$space()) {
      return NEVER;
    }
    const happeningID = this.slotContext.happening.id;
    if (!happeningID) {
      return NEVER;
    }
    const request: IHappeningContactRequest = {
      spaceID: this.$spaceID(),
      happeningID,
      contact: { id: contact.id },
    };
    return this.happeningService.addParticipant(request);
  };

  private readonly onContactRemoved = (
    member: IContactWithBrief,
  ): Observable<void> => {
    if (!this.slotContext || !this.$space()) {
      return NEVER;
    }
    const request: IHappeningContactRequest = {
      spaceID: this.$space().id,
      happeningID: this.slotContext.happening.id,
      contact: { id: member.id },
    };
    return this.happeningService.removeParticipant(request);
  };
}
