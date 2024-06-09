import { computed, signal } from '@angular/core';
// import {
// 	AbstractControl,
// 	FormGroup,
// 	UntypedFormGroup,
// 	ValidationErrors,
// 	ValidatorFn,
// } from '@angular/forms';
import { WeekdayCode2 } from '@sneat/mod-schedulus-core';
import { IErrorLogger } from '@sneat/logging';
import { SneatBaseComponent } from '@sneat/ui';

// const weekdayRequired: ValidatorFn = (
// 	control: AbstractControl,
// ): ValidationErrors | null => {
// 	const formGroup = control as UntypedFormGroup;
// 	const weekdaySelected = Object.values(formGroup.value).includes(true);
// 	if (weekdaySelected) {
// 		return null;
// 	}
// 	return { required: 'Please select at least 1 weekday.' };
// };

export abstract class WeekdaysFormBase extends SneatBaseComponent {
	protected readonly weekdayMo = signal(false);
	protected readonly weekdayTu = signal(false);
	protected readonly weekdayWe = signal(false);
	protected readonly weekdayTh = signal(false);
	protected readonly weekdayFr = signal(false);
	protected readonly weekdaySa = signal(false);
	protected readonly weekdaySu = signal(false);

	protected readonly hasWeekdaySelected = computed(
		() =>
			this.weekdayMo() ||
			this.weekdayTu() ||
			this.weekdayWe() ||
			this.weekdayTh() ||
			this.weekdayFr() ||
			this.weekdaySa() ||
			this.weekdaySu(),
	);

	protected readonly weekdaysCheckbox = computed(
		() =>
			this.weekdayMo() &&
			this.weekdayTu() &&
			this.weekdayWe() &&
			this.weekdayTh() &&
			this.weekdayFr(),
	);

	protected readonly weekendCheckbox = computed(
		() => this.weekdaySa() && this.weekdaySu(),
	);

	protected onWeekdaysCheckboxChange(checked: boolean): void {
		Object.entries(this.weekdayById).forEach((c) => {
			if (!this.isWeekend(c[0])) {
				c[1].set(checked);
			}
		});
	}

	private isWeekend(day: string): boolean {
		return day === 'sa' || day === 'su';
	}

	protected onWeekendCheckboxChange(checked: boolean): void {
		Object.entries(this.weekdayById).forEach((c) => {
			if (this.isWeekend(c[0])) {
				c[1].set(checked);
			}
		});
	}

	protected onWeekdayChanged(wd: WeekdayCode2, checked: boolean): void {
		console.log('onWeekdayChanged', wd, checked);
		this.weekdayById[wd].set(checked);
	}

	protected readonly weekdayById = {
		mo: this.weekdayMo,
		tu: this.weekdayTu,
		we: this.weekdayWe,
		th: this.weekdayTh,
		fr: this.weekdayFr,
		sa: this.weekdaySa,
		su: this.weekdaySu,
	};

	protected readonly selectedWeekdayCodes = computed(() =>
		Object.entries(this.weekdayById)
			.filter(([, c]) => c())
			.map(([wd]) => wd as WeekdayCode2),
	);

	protected constructor(
		className: string,
		errorLogger: IErrorLogger,
		protected readonly isWeekdayRequired: boolean,
	) {
		super(className, errorLogger);
	}
}
