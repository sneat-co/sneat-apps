import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import {
	emptyTiming,
	HappeningType,
	IHappeningSlot,
	ITiming,
	RepeatsWeek,
	SlotLocation,
	WeekdayCode2,
	IHappeningContext,
} from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { newRandomId } from '@sneat/random';
import { takeUntil } from 'rxjs';
import { StartEndDatetimeFormComponent } from '../start-end-datetime-form/start-end-datetime-form.component';
import { WeekdaysFormBase } from '../weekdays/weekdays-form-base';

type Happens = 'once' | 'weekly' | RepeatsWeek | 'fortnightly';

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

	get slots(): IHappeningSlot[] | undefined {
		return this.happening?.brief?.slots;
	}

	@Output() slotAdded = new EventEmitter<IHappeningSlot>();
	@Output() happeningChange = new EventEmitter<IHappeningContext>();
	@Output() eventTimesChanged = new EventEmitter<ITiming>();

	// minDate = '2000';
	// maxDate = '' + (new Date().getFullYear() + 5);

	repeats = new FormControl<Happens>('weekly', Validators.required);

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
	showWeekday = true;

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
		this.weekdaysForm.valueChanges.pipe(takeUntil(this.destroyed)).subscribe({
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

	repeatsChanged(): void {
		this.happens =
			!this.repeats.value || this.repeats.value == 'once'
				? 'weekly'
				: this.repeats.value;
	}

	addSlot(timing?: ITiming): void {
		// this.touchAllFormFields(this.slotForm);
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
			const l: SlotLocation = {};
			slot = { ...slot, location: l };
			if (formValue.locationTitle) {
				l.title = formValue.locationTitle;
			}
			if (formValue.locationAddress) {
				l.address = formValue.locationAddress;
			}
		}
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
