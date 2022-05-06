import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { IHappeningSlot, WeekdayCode2 } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

export interface AddSlotParams {
	wd?: WeekdayCode2;
}

@Component({
	selector: 'sneat-recurring-slots',
	templateUrl: './happening-slots.component.html',
})
export class HappeningSlotsComponent {

	@Input() slots?: IHappeningSlot[];

	@Output() addSlotDismissed = new EventEmitter<void>();
	@Output() slotAdded = new EventEmitter<IHappeningSlot>();
	@Output() slotRemoved = new EventEmitter<IHappeningSlot[]>();
	@Output() slotSelected = new EventEmitter<IHappeningSlot>();

	isShowingAddSlot = false;
	public addSlotParams?: AddSlotParams;

	readonly id = (i: number, record: { id: string }): string => record.id;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		// private readonly modalController: ModalController,
	) {
	}

	removeSlot(slot: IHappeningSlot): void {
		//tslint:disable-next-line:strict-comparisons
		this.slots = this.slots?.filter(v => v !== slot);
		this.slotRemoved.emit(this.slots);
	}

	selectSlot(slot: IHappeningSlot): void {
		this.slotSelected.emit(slot);
	}

	onSlotAdded(slot: IHappeningSlot): void {
		console.log('RecurringSlotsComponent.onSlotAdded()');
		this.isShowingAddSlot = false;
		this.slotAdded.emit(slot);
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
