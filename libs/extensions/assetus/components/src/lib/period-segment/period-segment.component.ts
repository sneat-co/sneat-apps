//tslint:disable:no-unsafe-any
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Period } from '@sneat/dto';

@Component({
	selector: 'sneat-period-segment',
	templateUrl: './period-segment.component.html',
})
export class PeriodSegmentComponent {
	@Input()
	public period?: Period;

	@Output() changed = new EventEmitter<Period>();

	segmentChanged(ev: CustomEvent): void {
		console.log('period segment changed', ev.detail);
		this.period = ev.detail.value;
		this.changed.emit(this.period);
	}
}
