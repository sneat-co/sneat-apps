import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'longMonthName' })
export class LongMonthNamePipe implements PipeTransform {
	// tslint:disable-next-line:prefer-function-over-method
	transform(month?: number): string {
		switch (month) {
			// tslint:disable-next-line:no-magic-numbers
			case 0:
				return 'January';
			// tslint:disable-next-line:no-magic-numbers
			case 1:
				return 'February';
			// tslint:disable-next-line:no-magic-numbers
			case 2:
				return 'March';
			// tslint:disable-next-line:no-magic-numbers
			case 3:
				return 'April';
			// tslint:disable-next-line:no-magic-numbers
			case 4:
				return 'May';
			// tslint:disable-next-line:no-magic-numbers
			case 5:
				return 'June';
			// tslint:disable-next-line:no-magic-numbers
			case 6:
				return 'July';
			// tslint:disable-next-line:no-magic-numbers
			case 7:
				return 'August';
			// tslint:disable-next-line:no-magic-numbers
			case 8:
				return 'September';
			// tslint:disable-next-line:no-magic-numbers
			case 9:
				return 'October';
			// tslint:disable-next-line:no-magic-numbers
			case 10:
				return 'November';
			// tslint:disable-next-line:no-magic-numbers
			case 11:
				return 'December';
			default:
				return '' + month;
		}
	}
}
