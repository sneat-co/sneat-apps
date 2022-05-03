import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { WeekdayCode2 } from '@sneat/dto';

const weekdayRequired: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
	const formGroup = control as FormGroup;
	const weekdaySelected = Object.values(formGroup.value)
		.indexOf(true) >= 0;
	if (weekdaySelected) {
		return null;
	}
	return { required: 'Please select at least 1 weekday.' };
};

export abstract class WeekdaysFormBase {
	readonly weekdayMo = new FormControl(false);
	readonly weekdayTu = new FormControl(false);
	readonly weekdayWe = new FormControl(false);
	readonly weekdayTh = new FormControl(false);
	readonly weekdayFr = new FormControl(false);
	readonly weekdaySa = new FormControl(false);
	readonly weekdaySu = new FormControl(false);

	protected readonly weekdayById = {
		'mo': this.weekdayMo,
		'tu': this.weekdayTu,
		'we': this.weekdayWe,
		'th': this.weekdayTh,
		'fr': this.weekdayFr,
		'sa': this.weekdaySa,
		'su': this.weekdaySu,
	};

	readonly weekdaysForm: FormGroup = new FormGroup(
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
		this.weekdaysForm = new FormGroup(
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
