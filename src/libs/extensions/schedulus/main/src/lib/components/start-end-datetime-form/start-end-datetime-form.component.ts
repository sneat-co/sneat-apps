import { AfterViewInit, Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ModalController, PopoverController } from '@ionic/angular';
import { dateToIso, isoStringsToDate, isValidaTimeString, isValidDateString } from '@sneat/core';
import { emptyHappeningSlot, IDateTime, IHappeningSlot, ITiming } from '@sneat/dto';
import { dateToTimeOnlyStr } from '@sneat/extensions/schedulus/shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-start-end-datetime-form',
	templateUrl: 'start-end-datetime-form.component.html',
})
export class StartEndDatetimeFormComponent implements AfterViewInit, OnChanges {
	// @Input() mode?: 'new' | 'edit' = 'new';
	@Input() happeningSlot: IHappeningSlot = emptyHappeningSlot;
	@Input() hideStartDate = false;
	@Output() readonly slotChanged = new EventEmitter<IHappeningSlot>();
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
		return isValidaTimeString(this.startTime.value) && isValidaTimeString(this.endTime.value);
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
		private readonly popoverController: PopoverController,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		const happeningSlotChange = changes['happeningSlot'];
		console.log('StartEndDatetimeFormComponent.ngOnChanges()', happeningSlotChange);
		if (happeningSlotChange?.currentValue) {
			this.startDate.setValue(this.happeningSlot.start.date);
			this.startTime.setValue(this.happeningSlot.start.time);
			this.endDate.setValue(this.happeningSlot.end?.date);
			this.endTime.setValue(this.happeningSlot.end?.time);
			this.setDuration();
		}
	}

	setStartTime(value: string): void {
		if (!isValidaTimeString(value)) {
			this.errorLogger.logError(new Error('not valid time string:' + value), 'Invalid start time');
			return;
		}
		this.modalController.dismiss().catch(console.error);
		this.startTime.setValue(value);
	}

	addToStart(v: { days?: number; hours?: number }): void {
		const d = isoStringsToDate(this.startDate.value, this.startTime.value);
		if (v.days) {
			d.setDate(d.getDate() + v.days);
		}
		if (v.hours) {
			d.setTime(d.getTime() + v.hours * 60 * 60 * 1000);
		}
		this.startDate.setValue(dateToIso(d));
		this.startTime.setValue(dateToTimeOnlyStr(d));
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
		console.log('StartEndDatetimeFormComponent.ngAfterViewInit', this.happeningSlot);
	}

	emitSlotChanged(): void {
		this.slotChanged.emit(this.happeningSlot);
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
		const slot = this.happeningSlot;
		this.happeningSlot = { ...slot, start: { ...(slot.start || {}), date: this.startDate.value } };
		if (
			isValidaTimeString(this.startTime.value as string) &&
			isValidaTimeString(this.endTime.value as string) &&
			isValidDateString(this.startDate.value as string)
		) {
			this.emitSlotChanged();
		}
	}

	onStartTimeChanged(event: Event): void {
		console.log('StartEndDatetimeFormComponent.onStartTimeChanged()', event);
		const slot = this.happeningSlot;
		this.happeningSlot = { ...slot, start: { ...(slot.start || {}), time: this.startTime.value } };
		if (isValidaTimeString(this.startTime.value as string)) {
			this.setEndTime();
		}
	}

	onDurationChanged(event: Event): void {
		console.log('StartEndDatetimeFormComponent.onDurationChanged()', event);
		if (isValidaTimeString(this.startTime.value as string)) {
			this.setEndTime();
		}
		this.emitSlotChanged();
	}

	setEndTime(): void {
		console.log('setEndTime()');
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
		event.stopPropagation();
		const slot = this.happeningSlot;
		this.happeningSlot = { ...slot, end: { ...(slot.end || {}), time: this.endTime.value } };
		if (isValidaTimeString(this.startTime.value as string)) {
			this.setDuration();
		}
		this.emitSlotChanged();
	}


	setDuration(): void {
		const startTime = this.startTime.value as string;
		const endTime = this.endTime.value as string;

		if (!startTime || !endTime) {
			return;
		}

		const startHour = Number(startTime.substring(0, 2));
		const startMin = Number(startTime.substring(3, 5));
		const startAt = startHour * 60 + startMin;

		const endHour = Number(endTime.substring(0, 2));
		const endMin = Number(endTime.substring(3, 5));
		const endAt = endHour * 60 + endMin;

		const durationMinutes = endAt - startAt;
		this.duration.setValue(durationMinutes);
		this.happeningSlot = { ...this.happeningSlot, durationMinutes };
	}
}
