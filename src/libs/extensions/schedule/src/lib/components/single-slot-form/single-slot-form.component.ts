import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ITiming } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-single-slot-form',
	templateUrl: './single-slot-form.component.html',
	styleUrls: ['./single-slot-form.component.scss'],
})
export class SingleSlotFormComponent {

	@Output() readonly validChanged = new EventEmitter<boolean>();
	@Output() readonly timingChanged = new EventEmitter<ITiming>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
		console.log('SingleSlotFormComponent.constructor()');
	}

	onTimingChanged(timing: ITiming): void {
		this.timingChanged.emit(timing);
	}
}

