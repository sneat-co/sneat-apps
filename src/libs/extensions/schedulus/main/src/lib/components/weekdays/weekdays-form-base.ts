import { AbstractControl, FormControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
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
	readonly weekdayMo = new FormControl<boolean>(false);
	readonly weekdayTu = new FormControl<boolean>(false);
	readonly weekdayWe = new FormControl<boolean>(false);
	readonly weekdayTh = new FormControl<boolean>(false);
	readonly weekdayFr = new FormControl<boolean>(false);
	readonly weekdaySa = new FormControl<boolean>(false);
	readonly weekdaySu = new FormControl<boolean>(false);

	protected readonly weekdayById = {
		'mo': this.weekdayMo,
		'tu': this.weekdayTu,
		'we': this.weekdayWe,
		'th': this.weekdayTh,
		'fr': this.weekdayFr,
		'sa': this.weekdaySa,
		'su': this.weekdaySu,
	};

	readonly weekdaysForm: UntypedFormGroup = new UntypedFormGroup( // TODO: Make typed
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
