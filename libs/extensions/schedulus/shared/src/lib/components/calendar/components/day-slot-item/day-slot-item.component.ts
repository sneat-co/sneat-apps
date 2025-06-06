import {
	Component,
	Input,
	input,
	computed,
	ChangeDetectionStrategy,
	inject,
} from '@angular/core';
import {
	PopoverController,
	PopoverOptions,
	IonBadge,
	IonButton,
	IonButtons,
	IonIcon,
	IonItem,
	IonLabel,
	IonText,
} from '@ionic/angular/standalone';
import { IContactusSpaceDboAndID } from '@sneat/contactus-core';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { ContactsSelectorModule } from '@sneat/contactus-shared';
import { WithSpaceInput } from '@sneat/space-services';
import {
	CalendarNavService,
	CalendarNavServicesModule,
	HappeningServiceModule,
} from '../../../../services';
import { ISlotUIContext } from '@sneat/mod-schedulus-core';
import { HappeningSlotModalServiceModule } from '../../../happening-slot-form/happening-slot-modal.service';
import { HappeningSlotParticipantsComponent } from '../../../happening-slot-participants/happening-slot-participants.component';
import { TimingBadgeComponent } from '../timing-badge/timing-badge.component';

@Component({
	providers: [ContactusSpaceService],
	imports: [
		HappeningServiceModule,
		ContactsSelectorModule,
		HappeningSlotModalServiceModule,
		HappeningSlotParticipantsComponent,
		TimingBadgeComponent,
		// MembersAsBadgesComponent,
		CalendarNavServicesModule,
		IonItem,
		IonIcon,
		IonLabel,
		IonText,
		IonBadge,
		IonButtons,
		IonButton,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-day-slot-item',
	templateUrl: './day-slot-item.component.html',
})
export class DaySlotItemComponent extends WithSpaceInput {
	private readonly popoverController = inject(PopoverController);
	private readonly calendarNavService = inject(CalendarNavService);

	public readonly $slotContext = input.required<ISlotUIContext>();

	@Input() dateID?: string;

	@Input() mode: 'full' | 'brief' = 'full';
	@Input() color?: 'light';

	@Input() contactusSpace?: IContactusSpaceDboAndID;

	protected readonly $isCanceled = computed(() => {
		const { happening, adjustment } = this.$slotContext();
		return happening?.brief?.status === 'canceled' || !!adjustment?.canceled;
	});

	constructor() {
		super('DaySlotItemComponent');
	}

	protected onSlotClicked(event: Event): void {
		console.log('DaySlotItemComponent.onSlotClicked()');
		event.stopPropagation();
		const slot = this.$slotContext();
		if (!slot) {
			return;
		}
		this.calendarNavService.navigateToHappeningPage({
			slot: slot,
			event,
		});
	}

	protected async showContextMenu(
		event:
			| MouseEvent
			| TouchEvent
			| PointerEvent
			| CustomEvent<unknown>
			| undefined,
	): Promise<void> {
		event?.preventDefault();
		event?.stopPropagation();

		// Need to import dynamically due to circular depndency with DaySlotItemComponent
		import('./slot-context-menu.component').then(async (m) => {
			const slotContext = this.$slotContext();
			console.log(
				'DaySlotItemComponent.showContextMenu() slotContext:',
				slotContext,
			);
			const popoverOptions: PopoverOptions = {
				component: m.SlotContextMenuComponent,
				componentProps: {
					$space: this.$space,
					slotContext,
					dateID: this.dateID,
					// state: stateOutput,
				},
				event,
			};

			const popover = await this.popoverController.create(popoverOptions);
			await popover.present(event);
		});
	}
}
