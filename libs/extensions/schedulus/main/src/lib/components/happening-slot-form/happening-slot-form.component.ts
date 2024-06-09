import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	signal,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { ISelectItem } from '@sneat/components';
import {
	emptyTiming,
	HappeningType,
	IHappeningSlot,
	ITiming,
	MonthlyMode,
	SlotLocation,
	WeekdayCode2,
	IHappeningContext,
	Month,
} from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { newRandomId } from '@sneat/random';
import { takeUntil } from 'rxjs';
import { StartEndDatetimeFormComponent } from '../start-end-datetime-form/start-end-datetime-form.component';
import { WeekdaysFormBase } from '../weekdays/weekdays-form-base';

type Happens =
	| 'once'
	| 'daily'
	| 'weekly'
	| 'monthly'
	| 'yearly'
	| 'fortnightly';

@Component({
	selector: 'sneat-happening-slot-form',
	templateUrl: './happening-slot-form.component.html',
})
export class HappeningSlotFormComponent
	extends WeekdaysFormBase
	implements OnChanges, OnDestroy
{
	@Input({ required: true }) mode?: 'modal' | 'in-form';
	@Input() happening?: IHappeningContext;

	@ViewChild('startEndDatetimeForm')
	startEndDatetimeForm?: StartEndDatetimeFormComponent;

	public timing: ITiming = emptyTiming;

	public error?: string;

	public tab: 'when' | 'where' = 'when';

	get happeningType(): HappeningType | undefined {
		return this.happening?.brief?.type;
	}

	@Input() wd?: WeekdayCode2;
	@Input() date?: string;

	@Input() isToDo = false;

	get slots(): readonly IHappeningSlot[] | undefined {
		return this.happening?.brief?.slots;
	}

	@Output() slotAdded = new EventEmitter<IHappeningSlot>();
	@Output() happeningChange = new EventEmitter<IHappeningContext>();
	@Output() eventTimesChanged = new EventEmitter<ITiming>();

	// minDate = '2000';
	// maxDate = '' + (new Date().getFullYear() + 5);

	repeats = new FormControl<Happens | undefined>(
		undefined,
		Validators.required,
	);

	protected readonly repeatsOptions: readonly ISelectItem[] = [
		{ id: 'daily', title: 'Daily' },
		{ id: 'weekly', title: 'Weekly' },
		{ id: 'monthly', title: 'Monthly' },
		{ id: 'yearly', title: 'Yearly' },
	];

	monthlyMode = new FormControl<MonthlyMode | undefined>(
		undefined,
		Validators.required,
	);

	protected onMonthlyModeChanged(s: string): void {
		this.monthlyMode.setValue(s as unknown as MonthlyMode);
		this.setShowWeekdays();
	}

	protected numberOfDaysInMonth = 28;

	protected readonly monthlyModes: readonly ISelectItem[] = [
		{ id: 'monthly-day', title: 'Specific day' },
		{ id: 'monthly-week-1', title: 'First week' },
		{ id: 'monthly-week-2', title: 'Second week' },
		{ id: 'monthly-week-3', title: 'Third week' },
		{ id: 'monthly-week-4', title: 'Fourth week' },
		{ id: 'monthly-week-last', title: 'Last week' },
	];

	slotForm = new UntypedFormGroup({
		locationTitle: new FormControl<string>(''),
		locationAddress: new FormControl<string>(''),
	});

	// dateForm = new FormGroup({
	// 	date: new FormControl(undefined, Validators.required),
	// });
	timeForm = new UntypedFormGroup({
		repeats: this.repeats,
	});
	happens: Exclude<Happens, 'once'> = 'weekly';

	protected readonly showWeekdays = signal(false);

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		private readonly alertCtrl: AlertController,
		protected readonly modalCtrl: ModalController,
	) {
		super('RecurringSlotFormComponent', true, errorLogger);
		// const now = new Date();
		const preselectedWd = window.history.state.wd as WeekdayCode2;
		if (preselectedWd) {
			this.weekdaysForm.controls[preselectedWd].setValue(true);
		}
		this.weekdaysForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe({
			next: () => (this.error = undefined),
		});
	}

	// ngOnChanges(changes: SimpleChanges): void {
	// 	if (this.wd) {
	// 		this.weekdayById[this.wd]?.setValue(true);
	// 	}
	// }

	dismissModal(): void {
		this.modalCtrl
			.dismiss()
			.catch(this.errorLogger.logErrorHandler('failed to dismiss modal'));
	}

	onRepeatsChanged(value: string | undefined): void {
		this.repeats.setValue(value as Happens);
		this.happens =
			!this.repeats.value || this.repeats.value == 'once'
				? 'weekly'
				: this.repeats.value;
		this.setShowWeekdays();
	}

	private setShowWeekdays(): void {
		this.showWeekdays.set(
			this.repeats?.value === 'weekly' ||
				(this.repeats?.value === 'monthly' &&
					!!this.monthlyMode.value?.startsWith('monthly-week')),
		);
	}

	private addWeeklySlot(timing?: ITiming): void {
		this.weekdaysForm.markAsTouched({ onlySelf: true });
		this.slotForm.markAsTouched();
		console.log(
			'addSlot()',
			timing,
			' => this.slotForm.errors:',
			this.slotForm.controls['locationTitle']?.errors,
		);
		if (this.happeningType === 'recurring' && !this.weekdaysForm.valid) {
			this.error = 'At least 1 weekday should be selected';
		}
		if (!this.startEndDatetimeForm?.isValid) {
			console.log('startEndDatetimeForm is not valid');
			return;
		}
		if (this.happeningType === 'recurring' && !this.weekdaysForm.valid) {
			console.log('weekdaysForm is not valid');
			return;
		}
		// if (!this.weekdaysForm.valid) {
		// 	this.showWeekday = false;
		//
		// 	this.alertCtrl.create({
		// 		header: 'Please select day(s)',
		// 		inputs: wd2.map(wd => {
		// 			// tslint:disable-next-line:no-any
		// 			const result: { type: 'checkbox'; name: WeekdayCode2; value: WeekdayCode2; label: string; handler: (input: any) => void } = {
		// 				type: 'checkbox',
		// 				name: wd,
		// 				value: wd,
		// 				label: wdCodeToWeekdayLongName(wd),
		// 				handler: input => {
		// 					const v = this.weekdaysForm.get(wd);
		// 					if (v) {
		// 						v.setValue(input.checked);
		// 					} else {
		// 						console.error('!v', v);
		// 					}
		// 					console.log(input);
		// 				},
		// 			};
		// 			return result;
		// 		}),
		// 		buttons: [
		// 			{
		// 				text: 'OK',
		// 				handler: () => {
		// 					this.showWeekday = true;
		// 					if (this.weekdaysForm.valid) {
		// 						this.addSlot();
		// 					}
		// 				},
		// 			},
		// 			{
		// 				text: 'Cancel',
		// 				handler: () => {
		// 					this.showWeekday = true;
		// 				},
		// 			}],
		// 	})
		// 		.then(alert => {
		// 			alert.present()
		// 				.catch(this.errorLogger.logErrorHandler('failed to present alert'));
		// 		})
		// 		.then(value => {
		// 			console.log('Alert value:', value);
		// 		})
		// 		.catch(this.errorLogger.logErrorHandler('failed to create an alert'));
		// 	return;
		// }
		if (!this.slotForm.valid) {
			return;
		}
		const formValue = this.slotForm.value;
		if (!this.timing) {
			throw new Error('!this.timing');
		}
		const repeats = this.happens;
		if (!repeats) {
			throw new Error('!repeats');
		}
		let slot: IHappeningSlot = {
			...this.timing,
			id: newRandomId({ len: 3 }),
			repeats,
		};
		if (this.happeningType === 'recurring') {
			slot = {
				...slot,
				weekdays: Object.entries(this.weekdaysForm.value)
					.filter((entry) => entry[1])
					.map((entry) => entry[0]) as WeekdayCode2[],
			};
		}
		if (formValue.locationTitle || formValue.locationAddress) {
			let l: SlotLocation = {};
			slot = { ...slot, location: l };
			if (formValue.locationTitle) {
				l = { ...l, title: formValue.locationTitle };
			}
			if (formValue.locationAddress) {
				l = { ...l, address: formValue.locationAddress };
			}
			slot = { ...slot, location: l };
		}
		this.addSlotToHappening(slot);
	}

	protected monthlyDay?: number;
	protected yearlyMonth?: Month;

	protected readonly monthDays: readonly number[][] = [
		[1, 2, 3, 4, 5],
		[6, 7, 8, 9, 10],
		[11, 12, 13, 14, 15],
		[16, 17, 18, 19, 20],
		[21, 22, 23, 24, 25],
		[26, 27, 28, 29, 30, 31],
	];

	protected readonly months: string[] = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	protected setYearlyMonth(month: string): void {
		this.yearlyMonth = month as Month;
		switch (this.yearlyMonth) {
			case 'February':
				this.numberOfDaysInMonth = 28;
				break;
			case 'January':
			case 'March':
			case 'May':
			case 'July':
			case 'August':
			case 'October':
			case 'December':
				this.numberOfDaysInMonth = 31;
				break;
			case 'April':
			case 'June':
			case 'September':
			case 'November':
				this.numberOfDaysInMonth = 30;
				break;
		}
	}

	protected setMonthlyDay(day: number): void {
		this.monthlyDay = day;
		let slot: IHappeningSlot = {
			id: newRandomId({ len: 3 }),
			repeats: this.happens,
		};

		switch (this.happens) {
			case 'monthly':
				slot = { ...slot, day };
				break;
			case 'yearly':
				if (!this.yearlyMonth) {
					return;
				}
				slot = { ...slot, day, month: this.yearlyMonth };
				break;
		}
		this.addSlotToHappening(slot);
	}

	private addSlotToHappening(slot: IHappeningSlot): void {
		if (!this.happening?.brief) {
			throw new Error('!this.happening?.brief');
		}
		this.happening = {
			...this.happening,
			brief: {
				...this.happening.brief,
				slots: [...(this.happening.brief.slots || []), slot],
			},
		};
		console.log('happening:', this.happening);
		this.slotAdded.emit(slot);
		this.happeningChange.emit(this.happening);
	}

	// private addYearlySlot(): void {
	// 	alert('not implemented yet');
	// 	const slot: IHappeningSlot = {
	// 		id: 'y1',
	// 		repeats: 'yearly',
	// 		day: ['may-21'],
	// 	};
	// 	this.addSlotToHappening(slot);
	// }

	protected addSlot(timing?: ITiming): void {
		switch (this.happens) {
			case 'weekly':
				this.addWeeklySlot(timing);
				break;
			// case 'yearly':
			// 	this.addYearlySlot();
			// 	break;
		}
		// this.touchAllFormFields(this.slotForm);
	}

	// onTimeStartsChanged(event: Event): void {
	// 	const { detail } = (event as CustomEvent);
	// 	const startInMinutes = ionTimeToMinutes(detail.value);
	// 	const durationInMinutes = ionTimeToMinutes(this.timeDuration.value);
	// 	const endInISO = minutesToIonTime(startInMinutes + durationInMinutes);
	// 	// console.log(startInMinutes, durationInMinutes, endInISO, 'timeEnds.value:', timeEnds.value);
	// 	if (this.timeEnds.value !== endInISO) {
	// 		this.timeEnds.setValue(endInISO);
	// 		this.onEventTimesChanged();
	// 	}
	// }
	//
	// onTimeDurationChanged(): void {
	// 	const startInMinutes = ionTimeToMinutes(this.timeStarts.value);
	// 	const durationInMinutes = ionTimeToMinutes(this.timeDuration.value);
	// 	const endInISO = minutesToIonTime(startInMinutes + durationInMinutes);
	// 	// console.log(startInMinutes, durationInMinutes, endInISO, 'timeEnds.value:', timeEnds.value);
	// 	if (this.timeEnds.value !== endInISO) {
	// 		this.timeEnds.setValue(endInISO);
	// 		this.onEventTimesChanged();
	// 	}
	// }
	//
	// onTimeEndsChanged(/*event: CustomEvent*/): void {
	// 	const startInMinutes = ionTimeToMinutes(this.timeStarts.value);
	// 	const endInMinutes = ionTimeToMinutes(this.timeEnds.value);
	// 	const durationInISO = minutesToIonTime(endInMinutes - startInMinutes);
	// 	// console.log(startInMinutes, durationInISO, endInMinutes, 'timeDuration.value:', timeDuration.value);
	// 	if (this.timeDuration.value !== durationInISO) {
	// 		this.timeDuration.setValue(durationInISO);
	// 	}
	// 	this.onEventTimesChanged();
	// }

	public onEventTimesChanged(): void {
		if (!this.date) {
			return;
		}
		// const timestamp = (c: FormControl): number => isoStringsToDate(this.date, c.value)
		// 	.getTime();
		this.eventTimesChanged.emit(this.timing);
	}

	public onTimingChanged(timing: ITiming): void {
		console.log('onTimingChanged()', timing);
		this.timing = timing;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['wd']) {
			const wd = this.wd;
			if (wd) {
				const formControl = this.weekdaysForm.controls[wd];
				formControl.setValue(true);
			}
		}
	}
}

// function ionTimeToMinutes(v: string): number {
// 	if (v.includes('T')) {
// 		v = v.split('T')[1];
// 	}
// 	const [hours, minutes] = v.split(':')
// 		.map(i => +i);
// 	// tslint:disable-next-line:no-magic-numbers
// 	return hours * 60 + minutes;
// }

// function minutesToIonTime(v: number): string {
// 	// tslint:disable-next-line:no-magic-numbers
// 	const minutes = v % 60;
// 	// tslint:disable-next-line:no-magic-numbers
// 	const hh = ((v - minutes) / 60).toString()
// 		// tslint:disable-next-line:no-magic-numbers
// 		.padStart(2, '0');
// 	const mm = minutes.toString()
// 		// tslint:disable-next-line:no-magic-numbers
// 		.padStart(2, '0');
// 	return `${hh}:${mm}`;
// }
