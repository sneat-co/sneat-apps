import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WeekdayCode2 } from '@sneat/dto';
import { WeekdaysFormBase } from '../weekdays/weekdays-form-base';
import { IScheduleFilter } from './schedule-filter';

type Repeat = 'w'
@Component({
	selector: 'sneat-schedule-filter',
	templateUrl: 'schedule-filter.component.html',
})
export class ScheduleFilterComponent extends WeekdaysFormBase {
	private resetting = false;
	@Input() showWeekdays = false;
	@Input() showRepeats = false;
	@Output() readonly changed = new EventEmitter<IScheduleFilter>();
	readonly text = new FormControl('');
	weekdays: WeekdayCode2[] = [];
	memberIDs: string[] = [];
	repeats: string[] = [];

	readonly repeatWeekly = new FormControl(false);
	readonly repeatMonthly = new FormControl(false);
	readonly repeatQuarterly = new FormControl(false);
	readonly repeatYearly = new FormControl(false);

	public get hasFilter(): boolean {
		return !!this.text.value.trim() ||
			!!this.weekdays?.length ||
			!!this.memberIDs?.length ||
			!!this.repeats?.length;
	}

	constructor() {
		super(false);
	}

	clearFilter(event?: Event): void {
		event?.stopPropagation();
		this.resetting = true;
		try {
			this.memberIDs = [];
			this.repeats = [];
			this.weekdays = [];

			const resetFormControlOptions = {
				onlySelf: true,
				emitEvent: false,
				emitModelToViewChange: true,
				emitViewToModelChange: false,
			};
			this.text.setValue('', resetFormControlOptions);
			Object.values(this.weekdayById)
				.forEach(wd => wd.setValue(false, resetFormControlOptions));
			this.repeatWeekly.setValue(false);
			this.repeatMonthly.setValue(false);
			this.repeatQuarterly.setValue(false);
			this.repeatYearly.setValue(false);
		} catch (e) {
			console.error(e);
		}
		this.resetting = false;
		this.emitChanged();
	}

	// repeatChecked(id: string): boolean {
	// 	return this.repeats.indexOf(id) >= 0;
	// }

	public repeatChanged(event: Event): void {
		const ce = event as CustomEvent;
		const { checked, value } = ce.detail;
		const found = this.repeats.indexOf(value) >= 0;
		if (checked) {
			if (!found) {
				this.repeats.push(value);
			}
		} else if (found) {
			this.repeats = this.repeats.filter(r => r !== value);
		}
		// console.log('repeatChanged()', checked, value, 'repeats', this.repeats);
		this.emitChanged();
	}

	emitChanged(): void {
		if (this.resetting) {
			return;
		}
		let filter: IScheduleFilter = { text: this.text.value };
		if (this.memberIDs.length) {
			filter = { ...filter, memberIDs: [...this.memberIDs] };
		}
		this.weekdays = this.selectedWeekdayCodes();
		if (this.weekdays.length) {
			filter = { ...filter, weekdays: this.weekdays };
		}
		if (this.repeats.length) {
			filter = { ...filter, repeats: [...this.repeats] };
		}
		this.changed.emit(filter);
	}
}
