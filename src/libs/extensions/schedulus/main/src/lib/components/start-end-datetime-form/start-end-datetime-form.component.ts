import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { dateToIso } from '@sneat/core';
import { IDateTime, ITiming } from '@sneat/dto';

@Component({
	selector: 'sneat-start-end-datetime-form',
	templateUrl: 'start-end-datetime-form.component.html',
})
export class StartEndDatetimeFormComponent implements AfterViewInit, OnChanges {
	@Input() date = '';
	@Input() hideStartDate = false;
	@Output() readonly timingChanged = new EventEmitter<ITiming>();
	public tab: 'duration' | 'end' = 'duration';
	public durationUnits: 'minutes' | 'hours' = 'minutes';
	public startDate = new FormControl('', { // dateToIso(new Date())
		// validators: Validators.required,
	});
	public endDate = new FormControl('', {
		// validators: Validators.required,
	});
	public readonly startTime = new FormControl('10:00', {
		validators: [
			Validators.required,
		],
	});
	public readonly endTime = new FormControl('11:00', {
		validators: [
			Validators.required,
		],
	});
	public readonly duration = new FormControl(60, {
		validators: [
			Validators.required,
		],
	});

	public get timing(): ITiming {
		let start: IDateTime = {
			time: this.startTime.value,
		};
		if (this.startDate.value) {
			start = { ...start, date: this.startDate.value };
		}
		let end: IDateTime = {
			time: this.endTime.value,
		};
		if (this.endDate.value) {
			end = { ...end, date: this.endDate.value };
		}
		const timing: ITiming = {
			start, end,
			durationMinutes: Number(this.duration.value),
		};
		return timing;
	}

	public get isValid(): boolean {
		return this.isValidTime(this.startTime.value) && this.isValidTime(this.endTime.value);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.date) {
			this.startDate.setValue(this.date);
		}
	}

	setStartDate(event: Event, code: 'today' | 'tomorrow'): void {
		console.log('setStartDate()', event);
		const today = new Date();
		let date: Date;
		switch (code) {
			case 'today':
				date = today;
				break;
			case 'tomorrow':
				date = new Date();
				date.setDate(today.getDate() + 1);
				break;
		}
		if (date) {
			this.startDate.setValue(dateToIso(date));
		}
	}

	ngAfterViewInit(): void {
		this.timingChanged.emit(this.timing);
	}

	onStartTimeBlur(event: Event): void {
		console.log('StartEndDatetimeFormComponent.onStartTimeBlur()', event);
		const startTime = this.startTime.value as string || '';
		if (startTime.match(/^\d{2}$/)) {
			this.startTime.setValue(startTime + ':00');
		}
	}

	onStartDateChanged(event: Event): void {
		console.log('StartEndDatetimeFormComponent.onStartDateChanged()', event);
		if (
			this.isValidTime(this.startTime.value as string) &&
			this.isValidTime(this.endTime.value as string) &&
			this.isValidDate(this.startDate.value as string)
		) {
			this.timingChanged.emit(this.timing);
		}
	}

	onStartTimeChanged(event: Event): void {
		console.log('StartEndDatetimeFormComponent.onStartTimeChanged()', event);
		if (this.isValidTime(this.startTime.value as string)) {
			this.setEndTime();
		}
		this.timingChanged.emit(this.timing);
	}

	isValidTime(v: string): boolean {
		return !!v.match(/^\d{2}:\d{2}$/);
	}

	isValidDate(v: string): boolean {
		return !!v.match(/^\d{4}-\d{2}-\d{2}$/);
	}

	onDurationChanged(event: Event): void {
		console.log('StartEndDatetimeFormComponent.onDurationChanged()', event);
		if (this.isValidTime(this.startTime.value as string)) {
			this.setEndTime();
		}
		this.timingChanged.emit(this.timing);
	}

	setEndTime(): void {
		const startTime = this.startTime.value as string;
		const startHour = Number(startTime.substring(0, 2));
		const startMin = Number(startTime.substring(3, 5));
		console.log(startTime, startHour, startMin);
		const duration = Number(this.duration.value);
		const durationHours = ~~(duration / 60);
		const durationMin = duration % 60;

		const toStr = (v: number) => {
			const s = ('00' + ('' + v).replace(/^0+/, ''));
			return s.substring(s.length - 2, s.length);
		};

		const endHour = toStr(startHour + durationHours);
		const endMin = toStr(startMin + durationMin);
		const value = `${endHour}:${endMin}`;
		console.log('StartEndDatetimeFormComponent.setEndTime()', endHour, endMin, value);
		this.endTime.setValue(value);
	}

	onEndTimeChanged(event: Event): void {
		if (this.isValidTime(this.startTime.value as string)) {
			this.setDuration();
		}
		this.timingChanged.emit(this.timing);
	}

	setDuration(): void {
		const startTime = this.startTime.value as string;
		const startHour = Number(startTime.substring(0, 2));
		const startMin = Number(startTime.substring(3, 5));
		const startAt = startHour * 60 + startMin;

		const endTime = this.endTime.value as string;
		const endHour = Number(endTime.substring(0, 2));
		const endMin = Number(endTime.substring(3, 5));
		const endAt = endHour * 60 + endMin;

		this.duration.setValue(endAt - startAt);
	}
}
