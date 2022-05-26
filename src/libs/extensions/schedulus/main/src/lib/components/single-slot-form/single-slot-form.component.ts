import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ITiming } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IHappeningContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-single-slot-form',
	templateUrl: './single-slot-form.component.html',
	styleUrls: ['./single-slot-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleSlotFormComponent implements OnChanges {

	@Input() happening?: IHappeningContext;
	@Input() date = '';

	@Output() readonly validChanged = new EventEmitter<boolean>();
	@Output() readonly timingChanged = new EventEmitter<ITiming>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
	) {
		console.log('SingleSlotFormComponent.constructor()');
	}

	onTimingChanged(timing: ITiming): void {
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
		await this.modalController.dismiss()
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['happening']) {

		}
	}

	private processHappening(): void {

	}
}

