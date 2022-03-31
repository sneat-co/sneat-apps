//tslint:disable:no-unsafe-any
//tslint:disable:no-unbound-method
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {isoStringsToDate} from 'sneat-shared/utils/datetimes';
import {AlertController} from '@ionic/angular';
import {wd2} from '../../view-models';
import {wdCodeToWeekdayName} from 'sneat-shared/components/pipes';
import {Weekday} from 'sneat-shared/models/types';
import {Slot, SlotLocation} from 'sneat-shared/models/dto/dto-happening';
import {IErrorLogger} from '../../../../services/interfaces';

@Component({
	selector: 'app-regular-slot-form',
	templateUrl: './regular-slot-form.component.html',
})
export class RegularSlotFormComponent implements OnInit {

	@Input() happeningKind: 'regular' | 'single';
	@Input() isToDo: boolean;
	@Input() slots: Slot[];
	@Output() slotAdded = new EventEmitter<void>();
	@Output() eventTimesChanged = new EventEmitter<{ from: Date; to: Date }>();

	minDate = '2019';
	maxDate = '2023';

	timeStarts = new FormControl('10:00', Validators.required);
	timeDuration = new FormControl('00:00', Validators.required);
	timeEnds = new FormControl('11:00', Validators.required);
	repeats = new FormControl('weekly', Validators.required);

	slotForm = new FormGroup({
		locationTitle: new FormControl(''),
		locationAddress: new FormControl(''),
	});


	timeForm = new FormGroup({
		timeStarts: this.timeStarts,
		timeDuration: this.timeDuration,
		timeEnds: this.timeEnds,
		repeats: this.repeats,
	});

	// dateForm = new FormGroup({
	// 	date: new FormControl(undefined, Validators.required),
	// });

	happens: 'fortnightly' | 'weekly' | 'once' = 'weekly';

	showWeekday = true;
	date: string;

	// tslint:disable-next-line:ban-ts-ignore
	// @ts-ignore
	weekdayRequired: ValidatorFn = (formGroup: FormGroup): ValidationErrors | undefined => {
		const weekdaySelected = Object.values(formGroup.value)
			.indexOf(true) >= 0;
		if (weekdaySelected) {
			return undefined;
		}
		return {required: 'Please select at least 1 weekday.'};
		// tslint:disable-next-line:semicolon
	};

	// tslint:disable-next-line:member-ordering
	weekdaysForm = new FormGroup(
		{
			mo: new FormControl(false),
			tu: new FormControl(false),
			we: new FormControl(false),
			th: new FormControl(false),
			fr: new FormControl(false),
			sa: new FormControl(false),
			su: new FormControl(false),
		},
		this.weekdayRequired);


	constructor(
		private readonly errorLogger: IErrorLogger,
		private readonly alertCtrl: AlertController,
	) {
		const now = new Date();
		this.minDate = now.getFullYear()
			.toString();
		this.maxDate = (now.getFullYear() + 5)
			.toString();
		const preselectedWd = window.history.state.wd as string;
		if (preselectedWd) {
			this.weekdaysForm.controls[preselectedWd].setValue(true);
		}
	}

	ngOnInit(): void {
		this.timeDuration.setValue(this.isToDo ? '00:00' : '01:00');
		this.onTimeDurationChanged();
	}

	repeatsChanged(): void {
		this.happens = this.repeats.value;
	}


	addSlot(): void {
		// this.touchAllFormFields(this.slotForm);
		this.weekdaysForm.markAsTouched({onlySelf: true});
		this.slotForm.markAsTouched();
		console.log('this.slotForm.errors:', this.slotForm.controls.locationTitle.errors);
		if (!this.weekdaysForm.valid) {
			this.showWeekday = false;

			this.alertCtrl.create({
				header: 'Please select day(s)',
				inputs: wd2.map(wd => {
					// tslint:disable-next-line:no-any
					const result: { type: 'checkbox'; name: Weekday; value: Weekday; label: string; handler: (input: any) => void } = {
						type: 'checkbox',
						name: wd,
						value: wd,
						label: wdCodeToWeekdayName(wd),
						handler: input => {
							const v = this.weekdaysForm.get(wd);
							if (v) {
								v.setValue(input.checked);
							} else {
								console.error('!v', v);
							}
							console.log(input);
						},
					};
					return result;
				}),
				buttons: [
					{
						text: 'OK',
						handler: () => {
							this.showWeekday = true;
							if (this.weekdaysForm.valid) {
								this.addSlot();
							}
						},
					},
					{
						text: 'Cancel',
						handler: () => {
							this.showWeekday = true;
						},
					}],
			})
				.then(alert => {
					alert.present()
						.catch(this.errorLogger.logError);
				})
				.then(value => {
					console.log('Alert value:', value);
				})
				.catch(this.errorLogger.logError);
			return;
		}
		if (!this.slotForm.valid) {
			return;
		}
		const formValue = this.slotForm.value;
		const slot: Slot = {
			time: {
				repeats: 'weekly',
				starts: formValue.timeStarts as string,
				ends: formValue.timeEnds as string,
				weekdays: Object.entries(this.weekdaysForm.value)
					.filter(entry => entry[1])
					.map(entry => entry[0]) as Weekday[]
			},
		};
		if (formValue.locationTitle || formValue.locationAddress) {
			const l: SlotLocation = slot.location = {};
			if (formValue.locationTitle) {
				l.title = formValue.locationTitle;
			}
			if (formValue.locationAddress) {
				l.address = formValue.locationAddress;
			}
		}
		this.slots.push(slot);
		this.slotAdded.emit();
	}

	onTimeStartsChanged(event: CustomEvent): void {
		const startInMinutes = ionTimeToMinutes(event.detail.value);
		const durationInMinutes = ionTimeToMinutes(this.timeDuration.value);
		const endInISO = minutesToIonTime(startInMinutes + durationInMinutes);
		// console.log(startInMinutes, durationInMinutes, endInISO, 'timeEnds.value:', timeEnds.value);
		if (this.timeEnds.value !== endInISO) {
			this.timeEnds.setValue(endInISO);
			this.onEventTimesChanged();
		}
	}

	onTimeDurationChanged(): void {
		const startInMinutes = ionTimeToMinutes(this.timeStarts.value);
		const durationInMinutes = ionTimeToMinutes(this.timeDuration.value);
		const endInISO = minutesToIonTime(startInMinutes + durationInMinutes);
		// console.log(startInMinutes, durationInMinutes, endInISO, 'timeEnds.value:', timeEnds.value);
		if (this.timeEnds.value !== endInISO) {
			this.timeEnds.setValue(endInISO);
			this.onEventTimesChanged();
		}
	}

	onTimeEndsChanged(/*event: CustomEvent*/): void {
		const startInMinutes = ionTimeToMinutes(this.timeStarts.value);
		const endInMinutes = ionTimeToMinutes(this.timeEnds.value);
		const durationInISO = minutesToIonTime(endInMinutes - startInMinutes);
		// console.log(startInMinutes, durationInISO, endInMinutes, 'timeDuration.value:', timeDuration.value);
		if (this.timeDuration.value !== durationInISO) {
			this.timeDuration.setValue(durationInISO);
		}
		this.onEventTimesChanged();
	}

	private onEventTimesChanged(): void {
		if (!this.date) {
			return;
		}
		const timestamp = (c: FormControl): number => isoStringsToDate(this.date, c.value)
			.getTime();
		this.eventTimesChanged.emit({
			from: new Date(timestamp(this.timeStarts)),
			to: new Date(timestamp(this.timeEnds))
		});
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
