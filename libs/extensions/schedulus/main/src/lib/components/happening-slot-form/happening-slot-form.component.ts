import { CommonModule } from '@angular/common';
import {
	Component,
	computed,
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
import {
	FormControl,
	FormsModule,
	ReactiveFormsModule,
	UntypedFormGroup,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import {
	ISelectItem,
	SelectFromListModule,
	SneatPipesModule,
} from '@sneat/components';
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
	RepeatPeriod,
	IHappeningSlotWithID,
} from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { newRandomId } from '@sneat/random';
import { HappeningService } from '@sneat/team-services';
import { StartEndDatetimeFormComponent } from '../start-end-datetime-form/start-end-datetime-form.component';
import { WeekdaysFormBase } from '../weekdays/weekdays-form-base';

type Happens =
	| 'once'
	| 'daily'
	| 'weekly'
	| 'monthly'
	| 'yearly'
	| 'fortnightly';

export type HappeningSlotFormMode = 'modal' | 'in-form';

export interface IHappeningSlotFormComponentInputs {
	mode?: HappeningSlotFormMode;
	happening?: IHappeningContext;
	slotID?: string;
	slot?: IHappeningSlot;
	wd?: WeekdayCode2;
	date?: string;
	isToDo?: boolean;
}

@Component({
	selector: 'sneat-happening-slot-form',
	templateUrl: './happening-slot-form.component.html',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		SneatPipesModule,
		SelectFromListModule,
		StartEndDatetimeFormComponent,
	],
})
/*
 INTENTIONALLY not decoupling weekdays form (WeekdaysFormBase) into a separate component
 as markup of the form is tightly coupled with the weekdays form
 as weekend & weekdays checkboxes are in the header of the form
 */
export class HappeningSlotFormComponent
	extends WeekdaysFormBase
	implements OnChanges, OnDestroy, IHappeningSlotFormComponentInputs
{
	@Input({ required: true }) mode?: HappeningSlotFormMode;
	@Input({ required: true }) happening?: IHappeningContext;
	@Input() slot?: IHappeningSlotWithID;
	@Input() wd?: WeekdayCode2;
	@Input() date?: string;
	@Input() isToDo = false;

	@Output() readonly slotAdded = new EventEmitter<IHappeningSlot>();
	@Output() readonly happeningChange = new EventEmitter<IHappeningContext>();
	@Output() readonly eventTimesChanged = new EventEmitter<ITiming>();

	@ViewChild('startEndDatetimeForm')
	startEndDatetimeForm?: StartEndDatetimeFormComponent;

	protected timing: ITiming = emptyTiming;

	protected readonly error = signal('');

	protected tab: 'when' | 'where' = 'when';

	protected get happeningType(): HappeningType | undefined {
		return this.happening?.brief?.type;
	}

	// minDate = '2000';
	// maxDate = '' + (new Date().getFullYear() + 5);

	protected readonly repeatsOptions: readonly ISelectItem[] = [
		{ id: 'daily', title: 'Daily' },
		{ id: 'weekly', title: 'Weekly' },
		{ id: 'monthly', title: 'Monthly' },
		{ id: 'yearly', title: 'Yearly' },
	];

	protected readonly monthlyMode = signal<MonthlyMode | ''>('');

	protected readonly monthlyDate = signal(0);

	protected onMonthlyModeChanged(s: string): void {
		this.monthlyMode.set(s as unknown as MonthlyMode);
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

	protected readonly slotForm = new UntypedFormGroup({
		locationTitle: new FormControl<string>(''),
		locationAddress: new FormControl<string>(''),
	});

	protected readonly happens = signal<Exclude<Happens, 'once'> | ''>('');

	protected readonly showWeekdays = computed(
		() =>
			this.happens() === 'daily' ||
			this.happens() === 'weekly' ||
			(this.happens() === 'monthly' &&
				this.monthlyMode()?.startsWith('monthly-week')),
	);

	protected readonly showTimeForm = computed(() => {
		const happens = this.happens();
		const monthlyMode = this.monthlyMode();
		const monthlyDate = this.monthlyDate();
		const hasWeekdaySelected = this.hasWeekdaySelected();
		return (
			happens === 'daily' ||
			(happens === 'weekly' && hasWeekdaySelected) ||
			(happens === 'monthly' &&
				((monthlyMode === 'monthly-day' && !!monthlyDate) ||
					(monthlyMode.includes('week') && hasWeekdaySelected)))
		);
	});

	protected readonly showAddSlotButton = computed(() => {
		const happens = this.happens();
		const monthlyMode = this.monthlyMode();
		const monthlyDate = this.monthlyDate();
		return (
			happens === 'daily' ||
			(happens === 'weekly' && this.hasWeekdaySelected()) ||
			(happens === 'monthly' && monthlyMode === 'monthly-day' && !!monthlyDate)
		);
	});

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		protected readonly modalCtrl: ModalController,
		private readonly happeningService: HappeningService,
	) {
		super('RecurringSlotFormComponent', errorLogger, true);
		// const now = new Date();
		const preselectedWd = window.history.state.wd as WeekdayCode2;
		if (preselectedWd) {
			this.weekdayById[preselectedWd].set(true);
		}
		// this.weekdaysForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe({
		// 	next: () => (this.error = undefined),
		// });
	}

	// ngOnChanges(changes: SimpleChanges): void {
	// 	if (this.wd) {
	// 		this.weekdayById[this.wd]?.setValue(true);
	// 	}
	// }

	// dismissModal(): void {
	// 	this.modalCtrl
	// 		.dismiss()
	// 		.catch(this.errorLogger.logErrorHandler('failed to dismiss modal'));
	// }

	protected onRepeatsChanged(value: string): void {
		const happens =
			!value || value === 'once'
				? 'weekly'
				: (value as Exclude<Happens, 'once'>);
		this.happens.set(happens);
		if (happens === 'daily') {
			Object.values(this.weekdayById).forEach((c) => c.set(true));
		}
	}

	override onWeekdayChanged(wd: WeekdayCode2, checked: boolean): void {
		super.onWeekdayChanged(wd, checked);
		if (!checked && this.happens() === 'daily') {
			this.happens.set('weekly');
		} else if (
			checked &&
			this.happens() === 'weekly' &&
			this.allWeekdaysSelected()
		) {
			this.happens.set('daily');
		}
	}

	private addWeeklySlot(timing?: ITiming): IHappeningSlotWithID | undefined {
		// this.weekdaysForm.markAsTouched({ onlySelf: true });
		this.slotForm.markAsTouched();
		console.log(
			'addSlot()',
			timing,
			' => this.slotForm.errors:',
			this.slotForm.controls['locationTitle']?.errors,
		);
		if (this.happeningType === 'recurring' && !this.hasWeekdaySelected()) {
			this.error.set('At least 1 weekday should be selected');
		}
		if (!this.startEndDatetimeForm?.isValid) {
			console.log('startEndDatetimeForm is not valid');
			return undefined;
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
			return undefined;
		}
		const formValue = this.slotForm.value;
		if (!this.timing) {
			throw new Error('!this.timing');
		}
		let slot = this.initiateSlot();
		if (this.happeningType === 'recurring') {
			slot = {
				...slot,
				weekdays: this.selectedWeekdayCodes(),
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
		return slot;
	}

	private initiateSlot(): IHappeningSlotWithID {
		let happens = this.happens();
		if (!happens) {
			throw new Error('!happens');
		}
		if (happens === 'daily') {
			happens = 'weekly';
		}
		return {
			...this.timing,
			repeats: happens as RepeatPeriod,
			id: '',
		};
	}

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
		this.monthlyDate.set(day);
	}

	protected addDaySlot(): IHappeningSlotWithID | undefined {
		const day = this.monthlyDate();
		let slot: IHappeningSlotWithID = {
			id: '',
			repeats: 'monthly',
		};

		switch (this.happens()) {
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
		return slot;
	}

	private addSlotToHappening(slotID: string, slot: IHappeningSlot): void {
		if (!this.happening?.brief) {
			throw new Error('!this.happening?.brief');
		}
		this.happening = {
			...this.happening,
			brief: {
				...this.happening.brief,
				slots: { ...this.happening.brief.slots, [slotID]: slot },
			},
		};
		console.log('happening:', this.happening);
		this.slotAdded.emit(slot);
		this.happeningChange.emit(this.happening);
	}

	private addYearlySlot(): IHappeningSlotWithID {
		return {
			id: '',
			repeats: 'yearly',
			// day: ['may-21'],
		};
	}

	protected addMonthlySlot(timing?: ITiming): IHappeningSlotWithID | undefined {
		console.log('addMonthlySlot()', timing);
		if (this.monthlyMode() === 'monthly-day') {
			return this.addDaySlot();
		}
		return undefined;
	}

	protected readonly isUpdating = signal(false);

	protected saveChanges(): void {
		console.log('saveChanges()');
		const slot = this.getSlot();
		const teamID = this.happening?.team?.id;
		const happeningID = this.happening?.id;
		if (!teamID || !happeningID || !slot) {
			return;
		}
		this.isUpdating.set(true);
		this.happeningService.updateSlot(teamID, happeningID, slot).subscribe({
			next: () => {
				this.modalCtrl
					.dismiss()
					.catch(this.errorLogger.logErrorHandler('failed to dismiss modal'));
			},
			error: (err) => {
				this.errorLogger.logError(err, 'failed to update happening slot');
				this.isUpdating.set(false);
			},
		});
	}

	protected addSlot(timing?: ITiming): void {
		console.log('addSlot()', timing);
		const slot = this.getSlot(timing);
		if (slot) {
			this.addSlotToHappening(newRandomId({ len: 3 }), slot);
		}
		// this.touchAllFormFields(this.slotForm);
	}

	private getSlot(timing?: ITiming): IHappeningSlotWithID | undefined {
		const happens = this.happens();
		switch (happens) {
			case 'daily':
			case 'weekly':
				return this.addWeeklySlot(timing);
			case 'monthly':
				return this.addMonthlySlot(timing);
			case 'yearly':
				return this.addYearlySlot();
			default:
				throw new Error(`unknown happens: ${happens}`);
		}
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
				this.weekdayById[wd].set(true);
			}
		}
		if (changes['slot']) {
			const slot = this.slot;
			if (slot) {
				if (slot.repeats !== 'once' && slot.repeats !== 'UNKNOWN') {
					this.happens.set(slot?.repeats);
				}
				slot.weekdays?.forEach((wd) => {
					this.weekdayById[wd].set(true);
				});
				this.timing = slot;
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
