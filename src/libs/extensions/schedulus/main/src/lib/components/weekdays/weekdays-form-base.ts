import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { WeekdayCode2 } from '@sneat/dto';

const weekdayRequired: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
	const formGroup = control as UntypedFormGroup;
	const weekdaySelected = Object.values(formGroup.value)
		.indexOf(true) >= 0;
	if (weekdaySelected) {
		return null;
	}
	return { required: 'Please select at least 1 weekday.' };
};

export abstract class WeekdaysFormBase {
	readonly weekdayMo = new UntypedFormControl(false);
	readonly weekdayTu = new UntypedFormControl(false);
	readonly weekdayWe = new UntypedFormControl(false);
	readonly weekdayTh = new UntypedFormControl(false);
	readonly weekdayFr = new UntypedFormControl(false);
	readonly weekdaySa = new UntypedFormControl(false);
	readonly weekdaySu = new UntypedFormControl(false);

	protected readonly weekdayById = {
		'mo': this.weekdayMo,
		'tu': this.weekdayTu,
		'we': this.weekdayWe,
		'th': this.weekdayTh,
		'fr': this.weekdayFr,
		'sa': this.weekdaySa,
		'su': this.weekdaySu,
	};

	readonly weekdaysForm: UntypedFormGroup = new UntypedFormGroup(
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

	protected constructor(isWeekdayRequired: boolean) {
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
		return Object
			.entries(this.weekdayById)
			.filter(([wd, c]) => c.value)
			.map(([wd, c]) => wd as WeekdayCode2);
	}
}
