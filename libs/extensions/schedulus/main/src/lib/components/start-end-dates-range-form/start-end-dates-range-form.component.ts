import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	signal,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IDateTime, ITiming } from '@sneat/mod-schedulus-core';

@Component({
	selector: 'sneat-start-end-dates-range-form',
	templateUrl: './start-end-dates-range-form.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class StartEndDatesRangeFormComponent implements OnChanges {
	@Input({ required: true }) timing?: ITiming;
	@Output() timingChange = new EventEmitter<ITiming>();

	protected startEnabled = signal(false);
	protected endEnabled = signal(false);

	protected onStartChecked(event: Event): void {
		const ce = event as CustomEvent;
		const checked = ce.detail.checked;
		this.startEnabled.set(checked);
		let start = this.timing?.start || { time: '' };
		if (!start.date) {
			start = { ...start, date: new Date().toISOString().substring(0, 10) };
			const timing = { ...this.timing, start };
			this.timing = timing;
			this.timingChange.emit(timing);
		}
	}

	protected onEndChecked(event: Event): void {
		const ce = event as CustomEvent;
		const checked = ce.detail.checked;
		this.endEnabled.set(checked);
	}

	protected onStartChanged(event: Event): void {
		const ce = event as CustomEvent;
		const date = ce.detail.value;
		const start: IDateTime = this.timing?.start || { time: '' };
		const timing = { ...this.timing, start: { ...start, date } };
		this.timingChange.emit(timing);
	}

	protected onEndChanged(event: Event): void {
		const ce = event as CustomEvent;
		const date = ce.detail.value;
		const end: IDateTime = this.timing?.end || { time: '' };
		const timing: ITiming = {
			...this.timing,
			end: { ...end, date },
			start: this.timing?.start || { date, time: '' },
		};
		this.timingChange.emit(timing);
	}

	public ngOnChanges(changes: SimpleChanges): void {
		// console.log('StartEndDatesRangeFormComponent.ngOnChanges', { changes });
		if (changes['timing']) {
			if (this.timing?.start?.date && !this.startEnabled()) {
				this.startEnabled.set(true);
			}
			if (this.timing?.end?.date && !this.startEnabled()) {
				this.endEnabled.set(true);
			}
		}
	}
}
