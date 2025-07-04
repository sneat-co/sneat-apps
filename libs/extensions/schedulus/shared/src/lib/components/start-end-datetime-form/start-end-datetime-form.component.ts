import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	ViewChild,
	inject,
} from '@angular/core';
import {
	FormControl,
	FormsModule,
	ReactiveFormsModule,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import {
	IonAccordion,
	IonAccordionGroup,
	IonButton,
	IonButtons,
	IonCol,
	IonDatetime,
	IonGrid,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonModal,
	IonPopover,
	IonRow,
	IonSelect,
	IonSelectOption,
	ModalController,
} from '@ionic/angular/standalone';
import {
	dateToIso,
	isoStringsToDate,
	isValidaTimeString,
	isValidDateString,
	SneatSelectAllOnFocusDirective,
} from '@sneat/core';
import { emptyTiming, HappeningType, ITiming } from '@sneat/mod-schedulus-core';
import { dateToTimeOnlyStr } from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { isTomorrow } from '../calendar-core';
import { StartEndDatesRangeFormComponent } from '../start-end-dates-range-form/start-end-dates-range-form.component';
import { TimeSelectorComponent } from './time-selector.component';

@Component({
	selector: 'sneat-start-end-datetime-form',
	templateUrl: 'start-end-datetime-form.component.html',
	imports: [
		ReactiveFormsModule,
		FormsModule,
		TimeSelectorComponent,
		StartEndDatesRangeFormComponent,
		SneatSelectAllOnFocusDirective,
		IonAccordion,
		IonAccordionGroup,
		IonGrid,
		IonRow,
		IonCol,
		IonItem,
		IonInput,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		IonModal,
		IonDatetime,
		IonSelectOption,
		IonSelect,
		IonPopover,
	],
})
export class StartEndDatetimeFormComponent implements OnChanges {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly modalController = inject(ModalController);

	@Input() addSlotLabel?: string;
	@Input({ required: true }) mode?: HappeningType;
	@Input({ required: true }) date?: string;

	@Input({ required: true }) timing: ITiming = emptyTiming;
	@Output() readonly timingChange = new EventEmitter<ITiming>();

	@Output() readonly addClick = new EventEmitter<ITiming>();

	@ViewChild('durationInput') durationInput?: IonInput;

	protected readonly today = new Date();
	protected maxDate = new Date(this.today.getFullYear() + 1, 11, 31)
		.toISOString()
		.substring(0, 10);

	protected tab: 'duration' | 'end' = 'duration';
	protected durationUnits: 'minutes' | 'hours' = 'minutes';
	// protected startDateVal? = new Date().toISOString().substring(0, 10);

	protected readonly startDate = new FormControl<string>(
		'', //TODO: set to current date only for single happenings: new Date().toISOString().substring(0, 10),
		{
			// dateToIso(new Date())
			validators: Validators.required,
		},
	);
	protected readonly endDate = new FormControl<string>('', {
		// validators: Validators.required,
	});
	protected readonly startTime = new FormControl<string>('', {
		validators: [Validators.required, Validators.pattern(/[0-2]\d:[0-5]\d/)],
	});
	protected readonly endTime = new FormControl<string>('', {
		validators: [Validators.required, Validators.pattern(/[0-2]\d:[0-5]\d/)],
	});
	protected readonly duration = new FormControl<number>(60, {
		validators: [Validators.required],
	});

	protected readonly form = new UntypedFormGroup({
		startDate: this.startDate,
		startTime: this.startTime,
		endTime: this.endTime,
		duration: this.duration,
	});

	protected onTimingChanged(timing: ITiming): void {
		this.timingChange.emit(timing);
	}

	protected get disabled(): boolean {
		return !this.mode;
	}

	protected get hideStartDate(): boolean {
		return this.mode === 'recurring';
	}

	// public get timing(): ITiming {
	// 	let start: IDateTime = {
	// 		time: this.startTime.value || '',
	// 	};
	// 	if (this.startDate.value) {
	// 		start = { ...start, date: this.startDate.value };
	// 	}
	// 	let end: IDateTime = {
	// 		time: this.endTime.value || '',
	// 	};
	// 	if (this.endDate.value) {
	// 		end = { ...end, date: this.endDate.value };
	// 	}
	// 	const timing: ITiming = {
	// 		start, end,
	// 		durationMinutes: Number(this.duration.value),
	// 	};
	// 	return timing;
	// }

	// Is public property as might be used by component's parent component
	public get isValid(): boolean {
		this.form.markAllAsTouched();
		return (
			isValidaTimeString(this.startTime.value || '') &&
			(!this.endTime.value || isValidaTimeString(this.endTime.value))
		);
	}

	constructor() {
		console.log('StartEndDatetimeFormComponent.constructor()');
		this.endTime.disable();
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('StartEndDatetimeFormComponent.ngOnChanges', changes);
		if (changes['date']) {
			this.onDateChanged();
		}

		const happeningSlotChange = changes['timing'];
		if (happeningSlotChange?.currentValue) {
			this.onTimingChange();
		}
	}

	private onDateChanged(): void {
		console.log(
			'StartEndDatetimeFormComponent.onDateChanged()',
			'date:',
			this.date,
			'startDate:',
			this.startDate.value,
		);

		if (this.mode === 'single') {
			if (!this.startDate.dirty) {
				const date = this.date || new Date().toISOString().substring(0, 10);
				this.startDate.setValue(date);
				console.log('startDate.setValue()', this.startDate.value);
			}
		} else {
			this.startDate.setValue('');
			console.log('startDate.setValue() to empty string');
		}
	}

	private onTimingChange(): void {
		console.log('StartEndDatetimeFormComponent.onTimingChange', this.timing);
		// if (this.happeningSlot.repeats === 'UNKNOWN') {
		// 	this.setRepeatsBasedOnHappeningType();
		// }
		if (!this.startDate.dirty) {
			const startDate = this.timing.start?.date;
			if (startDate) {
				this.startDate.setValue(startDate);
				console.log('startDate.setValue()', this.startDate.value);
			}
		}
		if (!this.startTime.dirty) {
			this.startTime.setValue(this.timing.start?.time || '');
		}
		if (!this.endDate.dirty) {
			this.endDate.setValue(this.timing.end?.date || '');
		}
		if (!this.endTime.dirty) {
			this.endTime.setValue(this.timing.end?.time || '');
		}
		this.setDuration();
	}

	protected setStartTime(value: string): void {
		if (!isValidaTimeString(value)) {
			this.errorLogger.logError(
				new Error('not valid time string:' + value),
				'Invalid start time',
			);
			return;
		}
		this.modalController.dismiss().catch(console.error);
		this.startTime.setValue(value);
		this.timing = {
			...this.timing,
			start: { ...this.timing.start, time: value },
		};
		this.setEndTime();
		this.emitTimingChanged('setStartTime');
		setTimeout(() => {
			this.durationInput
				?.setFocus()
				.then(() => {
					// TODO: Remove this workaround once SneatSelectAllOnFocusDirective is fixed
					this.durationInput?.getInputElement()?.then((el) => el.select());
				})
				.catch(
					this.errorLogger.logErrorHandler(
						'Failed to set focus to duration input',
					),
				);
		}, 50);
	}

	protected addToStart(v: { days?: number; hours?: number }): void {
		console.log('addToStart()', v, this.startDate.value, this.startTime.value);
		let d: Date | undefined = undefined;
		try {
			let startDate = this.startDate.value || '';
			let startTime = this.startTime.value || '';
			d = isoStringsToDate(startDate || '2000-01-01', startTime);
			if (v.days) {
				d.setDate(d.getDate() + v.days);
			}
			if (v.hours) {
				d.setTime(d.getTime() + v.hours * 60 * 60 * 1000);
			}
			if (this.startDate.value) {
				// For recurring events startDate is not set
				startDate = dateToIso(d);
				this.timing = {
					...this.timing,
					start: { ...this.timing.start, date: startDate },
				};
				this.startDate.setValue(startDate);
				console.log('startDate.setValue()', this.startDate.value);
			}
			if (this.startTime.value) {
				startTime = dateToTimeOnlyStr(d);
				this.timing = {
					...this.timing,
					start: { ...this.timing.start, time: startTime },
				};
				this.startTime.setValue(startTime);
			}
			this.setEndTime();
			this.emitTimingChanged('addToStart');
		} catch (e) {
			throw new Error(
				`failed to add ${JSON.stringify(v)} to ${d} [${this.startDate.value} ${
					this.startTime.value
				}]: ${e}`,
			);
		}
	}

	// private setRepeatsBasedOnHappeningType(): void {
	// 	switch (this.mode) {
	// 		case 'recurring':
	// 			this.happeningSlot = {...this.happeningSlot};
	// 			break;
	// 		case 'single':
	// 			this.happeningSlot = {...this.happeningSlot};
	// 			break;
	// 	}
	// }

	protected setStartDate(event: Event, code: 'today' | 'tomorrow'): void {
		console.log('setStartDate()', event);
		const today = new Date();
		let d: Date;
		switch (code) {
			case 'today':
				d = today;
				break;
			case 'tomorrow':
				d = new Date();
				d.setDate(today.getDate() + 1);
				break;
		}
		if (d) {
			const date = dateToIso(d);
			this.startDate.setValue(date);
			console.log('startDate.setValue()', this.startDate.value);
			this.timing = {
				...this.timing,
				start: { ...this.timing.start, date: date },
			};
			this.emitTimingChanged('setStartDate');
		}
	}

	private emitTimingChanged(from: string): void {
		if (!from) {
			console.log(
				`StartEndDatetimeFormComponent.emitSlotChanged(from=${from})`,
				this.timing,
			);
		}
		this.timingChange.emit(this.timing);
	}

	protected addSlot(): void {
		if (this.mode === 'single' && !this.timing.start?.date) {
			alert('Please select date');
			return;
		}
		this.timingChange.emit(this.timing);
		this.addClick.emit(this.timing);
	}

	protected onStartTimeBlur(): void {
		// console.log('StartEndDatetimeFormComponent.onStartTimeBlur()');
		const startTime = (this.startTime.value as string) || '';
		if (startTime.match(/^\d{2}$/)) {
			this.startTime.setValue(startTime + ':00');
		}
	}

	protected onStartDateChanged(): void {
		console.log(
			'StartEndDatetimeFormComponent.onStartDateChanged()',
			this.startDate.value,
		);
		let startDate = this.startDate.value || '';
		if (startDate.includes('T')) {
			startDate = startDate.split('T')[0];
			this.startDate.setValue(startDate);
			console.log('startDate.setValue()', this.startDate.value);
		}
		const slot = this.timing;
		this.timing = {
			...slot,
			start: { ...(slot.start || {}), date: this.startDate.value || '' },
		};
		if (
			(!this.startTime.value ||
				isValidaTimeString(this.startTime.value as string)) &&
			(!this.endTime.value ||
				isValidaTimeString(this.endTime.value as string)) &&
			(!this.startDate.value ||
				isValidDateString(this.startDate.value as string))
		) {
			this.emitTimingChanged('onStartDateChanged');
		}
	}

	protected onStartTimeChanged(): void {
		const slot = this.timing;
		this.timing = {
			...slot,
			start: { ...(slot.start || {}), time: this.startTime.value || '' },
		};
		if (
			this.timing.start?.time &&
			!this.timing.start?.date &&
			this.startDate.value
		) {
			this.timing = {
				...this.timing,
				start: { ...this.timing.start, date: this.startDate.value },
			};
		}
		console.log(
			'StartEndDatetimeFormComponent.onStartTimeChanged() =>',
			this.timing,
		);
		if (
			isValidaTimeString(this.startTime.value as string) &&
			this.duration.value
		) {
			this.setEndTime();
		}
	}

	protected onDurationChanged(): void {
		// console.log('StartEndDatetimeFormComponent.onDurationChanged()');
		if (isValidaTimeString(this.startTime.value as string)) {
			this.setEndTime();
		} else {
			this.emitTimingChanged('onDurationChanged');
		}
	}

	private setEndTime(): void {
		console.log('setEndTime()');
		const startTime = this.startTime.value as string;
		const startHour = Number(startTime.substring(0, 2));
		const startMin = Number(startTime.substring(3, 5));

		const duration = Number(this.duration.value);
		console.log('starts:', startHour, startMin, 'duration:', duration);

		const durationHours = ~~(duration / 60);
		const durationMin = duration % 60;

		const toStr = (v: number) => {
			const s = '00' + ('' + v).replace(/^0+/, '');
			return s.substring(s.length - 2, s.length);
		};

		const endHour = toStr(startHour + durationHours);
		const endMin = toStr(startMin + durationMin);
		const endTime = `${endHour}:${endMin}`;
		this.timing = { ...this.timing, end: { time: endTime } };
		console.log(
			'StartEndDatetimeFormComponent.setEndTime() => endTime:',
			endTime,
		);
		this.endTime.setValue(endTime);
		this.emitTimingChanged('setEndTime');
	}

	protected onEndTimeChanged(): void {
		const slot = this.timing;
		this.timing = {
			...slot,
			end: { ...(slot.end || {}), time: this.endTime.value || '' },
		};
		if (isValidaTimeString(this.startTime.value as string)) {
			this.setDuration();
		}
		this.emitTimingChanged('onEndTimeChanged');
	}

	private setDuration(): void {
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
		this.timing = { ...this.timing, durationMinutes };
	}

	protected readonly isTomorrow = isTomorrow;
}
