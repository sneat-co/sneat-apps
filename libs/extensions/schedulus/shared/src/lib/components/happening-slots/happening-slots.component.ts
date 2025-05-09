import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	signal,
	SimpleChanges,
} from '@angular/core';
import {
	IonBadge,
	IonButton,
	IonButtons,
	IonIcon,
	IonItem,
	IonItemDivider,
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
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
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
	selector: 'sneat-happening-slots',
	templateUrl: './happening-slots.component.html',
	imports: [
		HappeningSlotModalServiceModule,
		WdToWeekdayPipe,
		Numeral2Pipe,
		IonItemDivider,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		IonItem,
		IonText,
		IonBadge,
		IonSpinner,
	],
})
export class HappeningSlotsComponent implements OnChanges {
	@Input() happening?: IHappeningContext;

	@Input() wd?: WeekdayCode2;

	@Output() readonly addSlotDismissed = new EventEmitter<void>();
	@Output() readonly slotAdded = new EventEmitter<IHappeningSlot>();
	// @Output() readonly slotRemoved = new EventEmitter<
	// 	readonly IHappeningSlotWithID[]
	// >();
	@Output() readonly slotSelected = new EventEmitter<IHappeningSlot>();

	protected readonly slots = signal<IHappeningSlotWithID[] | undefined>(
		undefined,
	);

	// protected isShowingSlotFormModal = false;
	//
	// protected addSlotParams?: AddSlotParams;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger, // private readonly modalController: ModalController,
		private readonly happeningService: HappeningService,
		private readonly happeningSlotModalService: HappeningSlotModalService,
	) {}

	protected removeSlot(event: Event, slot: IHappeningSlotWithID): void {
		event.preventDefault();
		event.stopPropagation();
		if (!this.happening?.brief) {
			throw new Error('!this.happening?.brief');
		}
		if (this.happening.id) {
			this.deleteSlot(slot);
		} else {
			this.removeSlotFromHappening(slot);
		}
	}

	private removeSlotFromHappening(slot: IHappeningSlotWithID): void {
		if (!this.happening?.brief) {
			throw new Error('!this.happening');
		}
		this.onHappeningChanged({
			...this.happening,
			brief: {
				...this.happening.brief,
				slots: Object.fromEntries(
					Object.entries(this.happening.brief.slots || {}).filter(
						([id]) => id !== slot.id,
					),
				),
			},
		});
	}

	private deleteSlot(slot: IHappeningSlotWithID): void {
		if (!this.happening?.brief) {
			throw new Error('!this.happening?.brief');
		}
		const happeningID = this.happening.id;
		if (!happeningID) {
			throw new Error('!happeningID');
		}
		const spaceID = this.happening?.space.id;
		if (!spaceID) {
			throw new Error('!spaceID');
		}
		const request: IDeleteSlotRequest = {
			spaceID: spaceID,
			happeningID,
			slotID: slot.id,
		};

		this.deletingSlotIDs.set([...this.deletingSlotIDs(), slot.id]);

		const removeFromDeletingSlotIDs = (delay: number) =>
			setTimeout(
				() =>
					this.deletingSlotIDs.set(
						this.deletingSlotIDs().filter((id) => id !== slot.id),
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

	protected readonly deletingSlotIDs = signal<readonly string[]>([]);

	protected selectSlot(event: Event, slot: IHappeningSlotWithID): void {
		this.slotSelected.emit(slot);
		this.showEditSlot(event, slot);
	}

	protected onSlotAdded(slot: IHappeningSlot): void {
		console.log('HappeningSlotsComponent.onSlotAdded()');
		// this.isShowingSlotFormModal = false;
		this.slotAdded.emit(slot);
	}

	protected onHappeningChanged(happening: IHappeningContext): void {
		console.log('HappeningSlotsComponent.onHappeningChanged()');
		this.happening = happening;
	}

	protected editingSlot?: IHappeningSlot;

	protected showEditSlot(event: Event, slot: IHappeningSlotWithID): void {
		event.stopPropagation();
		event.preventDefault();
		if (!this.happening) {
			return;
		}
		this.happeningSlotModalService
			.editSingleHappeningSlot(event, this.happening, undefined, slot)
			.catch(this.errorLogger.logErrorHandler('failed to open edit modal'));

		// this.addSlotParams = undefined;
		// this.editingSlot = slot;
		// this.isShowingSlotFormModal = true;
	}

	protected showAddSlot(event: Event, params?: AddSlotParams): void {
		console.log('RecurringSlotsComponent.showAddSlot(), params:', params);
		if (!this.happening) {
			return;
		}
		this.happeningSlotModalService
			.editSingleHappeningSlot(event, this.happening)
			.catch(this.errorLogger.logErrorHandler('failed to open edit modal'));

		// this.editingSlot = undefined;
		// this.addSlotParams = params;
		// this.isShowingSlotFormModal = true;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['happening']) {
			this.slots.set(
				Object.entries(this.happening?.brief?.slots || {}).map(
					([id, slot]) => ({ ...slot, id }),
				),
			);
		}
	}

	// onSlotFormModalDismissed(event: Event): void {
	// 	console.log('onAddSlotModalDismissed(), event:', event);
	// 	this.editingSlot = undefined;
	// 	this.isShowingSlotFormModal = false;
	// 	this.addSlotDismissed.next();
	// }
}
