//tslint:disable:no-unsafe-any
//tslint:disable:no-unbound-method
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
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { wdCodeToWeekdayLongName } from '@sneat/components';
import { HappeningType, IHappeningSlot, ITiming, RepeatsWeek, SlotLocation, WeekdayCode2 } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { newRandomId } from '@sneat/random';
import { wd2 } from '@sneat/extensions/schedulus/shared';
import { IHappeningContext } from '@sneat/team/models';
import { Subject, takeUntil } from 'rxjs';
import { StartEndDatetimeFormComponent } from '../start-end-datetime-form/start-end-datetime-form.component';
import { WeekdaysFormBase } from '../weekdays/weekdays-form-base';

@Component({
	selector: 'sneat-recurring-slot-form',
	templateUrl: './recurring-slot-form.component.html',
})
export class RecurringSlotFormComponent extends WeekdaysFormBase implements OnChanges, OnDestroy {

	@ViewChild('startEndDatetimeForm') startEndDatetimeForm?: StartEndDatetimeFormComponent;

	private readonly destroyed = new Subject<void>();

	private timing?: ITiming;

	public error?: string;

	public tab: 'when' | 'where' = 'when';

	@Input() mode: 'modal' | 'in-form' = 'modal'
	@Input() happening?: IHappeningContext;
	get happeningType(): HappeningType | undefined {
		return this.happening?.brief?.type;
	}
	@Input() wd?: WeekdayCode2;
	@Input() isToDo = false;

	get slots(): IHappeningSlot[] | undefined {
		return this.happening?.brief?.slots;
	}
	@Output() slotAdded = new EventEmitter<IHappeningSlot>();
	@Output() happeningChange = new EventEmitter<IHappeningContext>();
	@Output() eventTimesChanged = new EventEmitter<ITiming>();
	minDate = '2000';
	maxDate = '' + (new Date().getFullYear() + 5);
	repeats = new FormControl('weekly', Validators.required);
	slotForm = new FormGroup({
		locationTitle: new FormControl(''),
		locationAddress: new FormControl(''),
	});

	// dateForm = new FormGroup({
	// 	date: new FormControl(undefined, Validators.required),
	// });
	timeForm = new FormGroup({
		repeats: this.repeats,
	});
	happens: 'once' | 'weekly' | RepeatsWeek | 'fortnightly' = 'weekly';
	showWeekday = true;
	date = '';

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly alertCtrl: AlertController,
		protected readonly modalCtrl: ModalController,
	) {
		super(true);
		const now = new Date();
		const preselectedWd = window.history.state.wd as string;
		if (preselectedWd) {
			this.weekdaysForm.controls[preselectedWd].setValue(true);
		}
		this.weekdaysForm.valueChanges
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: () => this.error = undefined,
			});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.wd) {
			this.weekdayById[this.wd]?.setValue(true);
		}
	}

	dismissModal(): void {
		this.modalCtrl.dismiss()
			.catch(this.errorLogger.logErrorHandler('failed to dismiss modal'));
	}

	repeatsChanged(): void {
		this.happens = this.repeats.value;
	}

	addSlot(): void {
		// this.touchAllFormFields(this.slotForm);
		this.weekdaysForm.markAsTouched({ onlySelf: true });
		this.slotForm.markAsTouched();
		console.log('addSlot() => this.slotForm.errors:',
			this.slotForm.controls['locationTitle']?.errors,
		);
		if (!this.weekdaysForm.valid) {
			this.error = 'At least 1 weekday should be selected';
		}
		if (!this.startEndDatetimeForm?.isValid || !this.weekdaysForm.valid) {
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
		let slot: IHappeningSlot = {
			...this.timing,
			id: newRandomId({ len: 3 }),
			repeats: 'weekly',
			weekdays: Object.entries(this.weekdaysForm.value)
				.filter(entry => entry[1])
				.map(entry => entry[0]) as WeekdayCode2[],
		};
		if (formValue.locationTitle || formValue.locationAddress) {
			const l: SlotLocation = {};
			slot = {...slot, location: l}
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
			}
		}
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

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}
}

function ionTimeToMinutes(v: string): number {
	if (v.indexOf('T') >= 0) {
		v = v.split('T')[1];
	}
	const [hours, minutes] = v.split(':')
		.map(i => +i);
	// tslint:disable-next-line:no-magic-numbers
	return hours * 60 + minutes;
}

function minutesToIonTime(v: number): string {
	// tslint:disable-next-line:no-magic-numbers
	const minutes = v % 60;
	// tslint:disable-next-line:no-magic-numbers
	const hh = ((v - minutes) / 60).toString()
		// tslint:disable-next-line:no-magic-numbers
		.padStart(2, '0');
	const mm = minutes.toString()
		// tslint:disable-next-line:no-magic-numbers
		.padStart(2, '0');
	return `${hh}:${mm}`;
}
