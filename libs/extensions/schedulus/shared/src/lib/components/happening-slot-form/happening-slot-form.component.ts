import {
	Component,
	computed,
	EventEmitter,
	input,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	signal,
	SimpleChanges,
	ViewChild,
	inject,
} from '@angular/core';
import {
	FormControl,
	FormsModule,
	ReactiveFormsModule,
	UntypedFormGroup,
} from '@angular/forms';
import {
	IonButton,
	IonCheckbox,
	IonCol,
	IonGrid,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonList,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonSpinner,
	ModalController,
} from '@ionic/angular/standalone';
import { ISelectItem, SelectFromListComponent } from '@sneat/ui';
import {
	emptyTiming,
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
import { newRandomId } from '@sneat/random';
import { Observable } from 'rxjs';
import { StartEndDatetimeFormComponent } from '../start-end-datetime-form/start-end-datetime-form.component';
import { WeekdaysFormBase } from '../weekdays/weekdays-form-base';
import { HappeningService } from '../../services/happening.service';

type Happens = 'once' | 'weekly' | 'monthly' | 'yearly' | 'fortnightly';
type Repeats = Exclude<Happens, 'once'>;

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
	imports: [
		FormsModule,
		ReactiveFormsModule,
		SelectFromListComponent,
		StartEndDatetimeFormComponent,
		IonGrid,
		IonRow,
		IonCol,
		IonItem,
		IonSelect,
		IonSelectOption,
		IonCheckbox,
		IonItemDivider,
		IonList,
		IonLabel,
		IonButton,
		IonSpinner,
		IonIcon,
	],
	providers: [HappeningService],
	selector: 'sneat-happening-slot-form',
	templateUrl: './happening-slot-form.component.html',
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
	protected readonly modalCtrl = inject(ModalController);
	private readonly happeningService = inject(HappeningService);

	public readonly $happening = input.required<IHappeningContext>();
	public readonly $happeningID = computed(() => this.$happening().id);
	protected readonly $happeningType = computed(
		() => this.$happening().brief?.type,
	);

	@Input({ required: true }) mode?: HappeningSlotFormMode;
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

	// minDate = '2000';
	// maxDate = '' + (new Date().getFullYear() + 5);

	protected readonly repeatsOptions: readonly ISelectItem[] = [
		// { id: 'daily', title: 'Daily' },  // Daily does not make much sense, weekly covers it
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

	protected readonly isUpdating = signal(false);

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

	protected readonly repeats = signal<Repeats | undefined>(undefined);

	protected readonly showWeekdays = computed(
		() =>
			// this.happens() === 'daily' ||
			this.repeats() === 'weekly' ||
			(this.repeats() === 'monthly' &&
				this.monthlyMode()?.startsWith('monthly-week')),
	);

	protected readonly showTimeForm = computed(() => {
		const happens = this.repeats();
		const monthlyMode = this.monthlyMode();
		const monthlyDate = this.monthlyDate();
		const hasWeekdaySelected = this.hasWeekdaySelected();
		return (
			this.$happeningType() === 'single' ||
			// happens === 'daily' ||
			(happens === 'weekly' && hasWeekdaySelected) ||
			(happens === 'monthly' &&
				((monthlyMode === 'monthly-day' && !!monthlyDate) ||
					(monthlyMode.includes('week') && hasWeekdaySelected)))
		);
	});

	protected readonly showAddSlotButton = computed(() => {
		const happens = this.repeats();
		const monthlyMode = this.monthlyMode();
		const monthlyDate = this.monthlyDate();
		return (
			// happens === 'daily' ||
			(happens === 'weekly' && this.hasWeekdaySelected()) ||
			(happens === 'monthly' && monthlyMode === 'monthly-day' && !!monthlyDate)
		);
	});

	constructor() {
		super('RecurringSlotFormComponent', true);
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
		this.repeats.set(value as Repeats);
	}

	private addOnceSlot(timing?: ITiming): IHappeningSlot | undefined {
		this.slotForm.markAsTouched();
		const slot = this.initiateSlot(timing);
		return slot;
	}

	private addWeeklySlot(timing?: ITiming): IHappeningSlot | undefined {
		// this.weekdaysForm.markAsTouched({ onlySelf: true });
		this.slotForm.markAsTouched();
		console.log(
			'addSlot()',
			timing,
			' => this.slotForm.errors:',
			this.slotForm.controls['locationTitle']?.errors,
		);
		if (this.$happeningType() === 'recurring' && !this.hasWeekdaySelected()) {
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
		let slot = this.initiateSlot(timing);
		if (this.$happeningType() === 'recurring') {
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

	private initiateSlot(timing?: ITiming): IHappeningSlot {
		const repeats: RepeatPeriod | undefined =
			this.$happeningType() === 'single' ? 'once' : this.repeats();
		if (!repeats) {
			throw new Error('!repeats');
		}
		return {
			...(timing || this.timing),
			repeats,
		};
	}

	protected readonly yearlyMonth = new FormControl<Month | undefined>(
		undefined,
	);

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
		this.yearlyMonth.setValue(month as Month);
		switch (this.yearlyMonth.value) {
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

	protected addDaySlot(): IHappeningSlot | undefined {
		const day = this.monthlyDate();
		let slot: IHappeningSlot = {
			repeats: 'monthly',
		};

		switch (this.repeats()) {
			case 'monthly':
				slot = { ...slot, day };
				break;
			case 'yearly':
				if (!this.yearlyMonth.value) {
					return;
				}
				slot = { ...slot, day, month: this.yearlyMonth.value };
				break;
		}
		return slot;
	}

	private addSlotToHappening(timing?: ITiming): void {
		if (!this.$happening().brief) {
			throw new Error('!this.happening?.brief');
		}
		const slot = this.getSlot(timing);
		if (!slot) {
			return;
		}
		const slotID = this.generateSlotID();

		let happening = this.$happening();

		if (!happening.brief) {
			return;
		}

		happening = {
			...happening,
			brief: {
				...happening.brief,
				slots: { ...(happening.brief?.slots || {}), [slotID]: slot },
			},
		};
		console.log('happening:', happening);
		this.slotAdded.emit(slot);
		this.happeningChange.emit(happening);
	}

	private addYearlySlot(): IHappeningSlot {
		return {
			repeats: 'yearly',
			// day: ['may-21'],
		};
	}

	private addMonthlySlot(timing?: ITiming): IHappeningSlot | undefined {
		console.log('addMonthlySlot()', timing);
		if (this.monthlyMode() === 'monthly-day') {
			return this.addDaySlot();
		}
		return undefined;
	}

	protected saveChanges(): void {
		console.log('saveChanges()');
		const slot = this.getSlot();
		const happening = this.$happening();
		const spaceID = happening.space.id;
		const happeningID = happening.id;
		if (!spaceID || !happeningID || !slot) {
			return;
		}
		let id = this.slot?.id;
		const isNewSlot = !id;
		const putSlot: (
			spaceID: string,
			happeningID: string,
			slot: IHappeningSlotWithID,
		) => Observable<void> = isNewSlot
			? this.happeningService.addSlot
			: this.date
				? (spaceID: string, happeningID: string, slot: IHappeningSlotWithID) =>
						this.happeningService.adjustSlot(
							spaceID,
							happeningID,
							slot,
							this.date || '',
						)
				: this.happeningService.updateSlot;

		if (!id) {
			id = this.generateSlotID();
		}
		this.isUpdating.set(true);
		putSlot(spaceID, happeningID, { ...slot, id }).subscribe({
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

	protected applyChanges(): void {
		if (this.slot) {
			this.saveChanges();
		} else {
			this.addSlot();
		}
	}

	protected addSlot(timing?: ITiming): void {
		console.log('addSlot()', timing);
		if (this.$happeningID()) {
			this.saveChanges();
		} else {
			this.addSlotToHappening();
		}
	}

	private generateSlotID(): string {
		for (let i = 0; i < 10; i++) {
			const slotID = newRandomId({ len: 4 });
			if (!this.$happening().brief?.slots?.[slotID]) {
				return slotID;
			}
		}
		throw new Error('failed to generate unique slot ID');
	}

	private getSlot(timing?: ITiming): IHappeningSlot | undefined {
		switch (this.$happeningType()) {
			case 'single':
				return this.addOnceSlot(timing);
			case 'recurring': {
				const repeats = this.repeats();
				switch (repeats) {
					case 'weekly':
						return this.addWeeklySlot(timing);
					case 'monthly':
						return this.addMonthlySlot(timing);
					case 'yearly':
						return this.addYearlySlot();
					case undefined:
					default:
						throw new Error(`unknown repeats=[${repeats}]`);
				}
			}
			case undefined:
				throw new Error('happeningType is undefined');
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

	protected onTimingChanged(timing: ITiming): void {
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
					this.repeats.set(slot?.repeats);
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
