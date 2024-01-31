import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Period } from '@sneat/dto';

@Component({
	selector: 'sneat-period-segment',
	templateUrl: './period-segment.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
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
