import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges, OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { emptySingleHappeningSlot, IHappeningSlot, ITiming } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IHappeningContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-single-slot-form',
	templateUrl: './single-slot-form.component.html',
	styleUrls: ['./single-slot-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleSlotFormComponent implements AfterViewInit, OnChanges {

	@Input() happening?: IHappeningContext;
	@Input() isModal = false;

	@Output() readonly validChanged = new EventEmitter<boolean>();
	@Output() readonly timingChanged = new EventEmitter<ITiming>();

	singleSlot: IHappeningSlot = emptySingleHappeningSlot;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
	) {
		console.log('SingleSlotFormComponent.constructor()');
	}

	onTimingChanged(timing: ITiming): void {
		if (timing == emptySingleHappeningSlot) {
			return;
		}
		if (!timing.end) {
			this.errorLogger.logError('timing has no end');
			return;
		}
		if (!timing.durationMinutes) {
			this.errorLogger.logError('timing has no durationMinutes');
			return;
		}
		this.timingChanged.emit(timing);
	}

	async close(event: Event): Promise<void> {
		event.stopPropagation();
		await this.modalController.dismiss();
	}

	async save(event: Event): Promise<void> {
		event.stopPropagation();
		await this.modalController.dismiss();
	}

	ngAfterViewInit(): void {
		this.processHappening();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['happening']) {
			this.processHappening();
		}
	}

	private processHappening(): void {
		if (this.happening?.brief?.type === 'single') {
			if (this.happening?.brief?.slots?.length === 1) {
				this.singleSlot = this.happening.brief.slots[0];
			}
		}
	}

}

