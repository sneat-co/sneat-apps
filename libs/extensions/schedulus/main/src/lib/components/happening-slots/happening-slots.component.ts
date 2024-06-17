import { CommonModule } from '@angular/common';
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
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import {
	IHappeningSlot,
	WeekdayCode2,
	IHappeningContext,
	IHappeningSlotWithID,
} from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { HappeningSlotFormComponent } from '../happening-slot-form/happening-slot-form.component';
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
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		SneatPipesModule,
		HappeningSlotFormComponent,
		HappeningSlotModalServiceModule,
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
		private readonly happeningSlotModalService: HappeningSlotModalService,
	) {}

	protected removeSlot(slot: IHappeningSlotWithID): void {
		if (!this.happening?.brief) {
			throw new Error('!this.happening?.brief');
		}
		// this.happening =
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
		// this.slotRemoved.emit(this.happening.brief?.slots || []);
	}

	protected selectSlot(event: Event, slot: IHappeningSlot): void {
		this.slotSelected.emit(slot);
		this.showEditSlot(event, slot);
	}

	protected onSlotAdded(slot: IHappeningSlot): void {
		console.log('HappeningSlotsComponent.onSlotAdded()');
		// this.isShowingSlotFormModal = false;
		this.slotAdded.emit(slot);
	}

	protected onHappeningChanged(happening: IHappeningContext): void {
		console.log('HappeningSlotsComponent.onSlotAdded()');
		this.happening = happening;
	}

	protected editingSlot?: IHappeningSlot;

	protected showEditSlot(event: Event, slot: IHappeningSlot): void {
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
