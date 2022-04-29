import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ITiming } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-single-slot-form',
	templateUrl: './single-slot-form.component.html',
	styleUrls: ['./single-slot-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleSlotFormComponent {

	@Output() readonly validChanged = new EventEmitter<boolean>();
	@Output() readonly timingChanged = new EventEmitter<ITiming>();

	@Input() date = '';

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
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
}

