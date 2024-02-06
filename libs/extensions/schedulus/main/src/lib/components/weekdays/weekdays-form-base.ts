import {
	AbstractControl,
	FormControl,
	FormGroup,
	UntypedFormGroup,
	ValidationErrors,
	ValidatorFn,
} from '@angular/forms';
import { WeekdayCode2 } from '@sneat/mod-schedulus-core';
import { IErrorLogger } from '@sneat/logging';
import { SneatBaseComponent } from '@sneat/ui';

const weekdayRequired: ValidatorFn = (
	control: AbstractControl,
): ValidationErrors | null => {
	const formGroup = control as UntypedFormGroup;
	const weekdaySelected = Object.values(formGroup.value).includes(true);
	if (weekdaySelected) {
		return null;
	}
	return { required: 'Please select at least 1 weekday.' };
};

export abstract class WeekdaysFormBase extends SneatBaseComponent {
	readonly weekdaysCheckbox = new FormControl<boolean>(false);
	readonly weekendCheckbox = new FormControl<boolean>(false);

	protected onWeekdaysCheckboxChange(): void {
		const checked = this.weekdaysCheckbox.value;
		Object.entries(this.weekdayById).forEach((c) => {
			if (!this.isWeekend(c[0])) {
				c[1].setValue(checked);
			}
		});
	}

	private isWeekend(day: string): boolean {
		return day === 'sa' || day === 'su';
	}

	protected onWeekendCheckboxChange(): void {
		const checked = this.weekendCheckbox.value;
		Object.entries(this.weekdayById).forEach((c) => {
			if (this.isWeekend(c[0])) {
				c[1].setValue(checked);
			}
		});
	}

	protected onWeekdayChange(): void {
		this.weekdaysCheckbox.setValue(
			this.weekdayMo.value &&
				this.weekdayTu.value &&
				this.weekdayWe.value &&
				this.weekdayTh.value &&
				this.weekdayFr.value,
		);
		this.weekendCheckbox.setValue(this.weekdaySa.value && this.weekdaySu.value);
	}

	readonly weekdayMo = new FormControl<boolean>(false);
	readonly weekdayTu = new FormControl<boolean>(false);
	readonly weekdayWe = new FormControl<boolean>(false);
	readonly weekdayTh = new FormControl<boolean>(false);
	readonly weekdayFr = new FormControl<boolean>(false);
	readonly weekdaySa = new FormControl<boolean>(false);
	readonly weekdaySu = new FormControl<boolean>(false);

	protected readonly weekdayById = {
		mo: this.weekdayMo,
		tu: this.weekdayTu,
		we: this.weekdayWe,
		th: this.weekdayTh,
		fr: this.weekdayFr,
		sa: this.weekdaySa,
		su: this.weekdaySu,
	};

	readonly weekdaysForm = new FormGroup( // TODO: Make typed
		{
			mo: this.weekdayMo,
			tu: this.weekdayTu,
			we: this.weekdayWe,
			th: this.weekdayTh,
			fr: this.weekdayFr,
			sa: this.weekdaySa,
			su: this.weekdaySu,
		},
		weekdayRequired,
	);

	protected constructor(
		className: string,
		isWeekdayRequired: boolean,
		errorLogger: IErrorLogger,
	) {
		super(className, errorLogger);
		this.weekdaysForm = new UntypedFormGroup(
			{
				mo: this.weekdayMo,
				tu: this.weekdayTu,
				we: this.weekdayWe,
				th: this.weekdayTh,
				fr: this.weekdayFr,
				sa: this.weekdaySa,
				su: this.weekdaySu,
			},
			isWeekdayRequired ? weekdayRequired : undefined,
		);
	}

	protected selectedWeekdayCodes(): WeekdayCode2[] {
		return Object.entries(this.weekdayById)
			.filter(([, c]) => c.value)
			.map(([wd]) => wd as WeekdayCode2);
	}
}
