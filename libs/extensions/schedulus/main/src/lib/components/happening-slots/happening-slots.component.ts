import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
	IHappeningSlot,
	WeekdayCode2,
	IHappeningContext,
} from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

export interface AddSlotParams {
	wd?: WeekdayCode2;
}

@Component({
	selector: 'sneat-happening-slots',
	templateUrl: './happening-slots.component.html',
})
export class HappeningSlotsComponent {
	@Input() happening?: IHappeningContext;

	@Input() wd?: WeekdayCode2;

	@Output() addSlotDismissed = new EventEmitter<void>();
	@Output() slotAdded = new EventEmitter<IHappeningSlot>();
	@Output() slotRemoved = new EventEmitter<IHappeningSlot[]>();
	@Output() slotSelected = new EventEmitter<IHappeningSlot>();

	get slots(): IHappeningSlot[] | undefined {
		return this.happening?.brief?.slots;
	}

	protected isShowingAddSlot = false;

	public addSlotParams?: AddSlotParams;

	protected readonly id = (_: number, o: IHappeningSlot) => o.id;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger, // private readonly modalController: ModalController,
	) {}

	removeSlot(slot: IHappeningSlot): void {
		if (!this.happening?.brief) {
			throw new Error('!this.happening?.brief');
		}
		// this.happening =
		this.onHappeningChanged({
			...this.happening,
			brief: {
				...this.happening.brief,
				slots: this.happening.brief.slots?.filter((v) => v !== slot) || [],
			},
		});
		this.slotRemoved.emit(this.happening.brief?.slots || []);
	}

	selectSlot(slot: IHappeningSlot): void {
		this.slotSelected.emit(slot);
	}

	onSlotAdded(slot: IHappeningSlot): void {
		console.log('HappeningSlotsComponent.onSlotAdded()');
		this.isShowingAddSlot = false;
		this.slotAdded.emit(slot);
	}

	onHappeningChanged(happening: IHappeningContext): void {
		console.log('HappeningSlotsComponent.onSlotAdded()');
		this.happening = happening;
	}

	showAddSlot(params?: AddSlotParams): void {
		console.log('RecurringSlotsComponent.showAddSlot(), params:', params);
		// this.modalController.create({
		// 	component: RecurringSlotFormComponent,
		// 	componentProps: {
		//
		// 	}
		// })
		// 	.then(modal => {
		// 		modal.present()
		// 			.catch(this.errorLogger.logErrorHandler('failed to present modal with RecurringSlotsComponent'))
		// 	})
		// 	.catch(this.errorLogger.logErrorHandler('failed to create modal for RecurringSlotsComponent'));
		this.addSlotParams = params;
		this.isShowingAddSlot = true;
	}

	onAddSlotModalDismissed(event: Event): void {
		console.log('onAddSlotModalDismissed(), event:', event);
		this.isShowingAddSlot = false;
		this.addSlotDismissed.next();
	}
}
