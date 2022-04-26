import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'sneat-stat-end-datetime-form',
	templateUrl: 'start-end-datetime-form.component.html',
})
export class StartEndDatetimeFormComponent {
	@Input() hideStartDate = false;

	public tab: 'duration' | 'end' = 'duration';
	public durationUnits: 'minutes' | 'hours' = 'minutes';

	public date: Date = new Date();
	public day: string = '' + this.date.getDate();

	@Output() changed = new EventEmitter<void>();

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

	public readonly duration = new FormControl(60);

	public get isValid(): boolean {
		return this.isValidTime(this.startTime.value) && this.isValidTime(this.endTime.value);
	}

	onStartTimeBlur(event: Event): void {
		console.log('StartEndDatetimeFormComponent.onStartTimeBlur()', event);
		const startTime = this.startTime.value as string || '';
		if (startTime.match(/^\d{2}$/)) {
			this.startTime.setValue(startTime + ':00');
		}
	}

	onStartTimeChanged(event: Event): void {
		console.log('StartEndDatetimeFormComponent.onStartTimeChanged()', event);
		if (this.isValidTime(this.startTime.value as string)) {
			this.setEndTime();
		}
		this.changed.emit();
	}

	isValidTime(v: string): boolean {
		return !!v.match(/^\d{2}:\d{2}$/);
	}

	onDurationChanged(event: Event): void {
		console.log('StartEndDatetimeFormComponent.onDurationChanged()', event);
		if (this.isValidTime(this.startTime.value as string)) {
			this.setEndTime();
		}
		this.changed.emit();
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
		this.changed.emit();
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
