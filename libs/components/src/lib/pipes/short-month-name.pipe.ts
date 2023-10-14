import { Pipe, PipeTransform } from '@angular/core';

export const shortMonthNamesByNumber = [
	'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

@Pipe({ name: 'shortMonthName' })
export class ShortMonthNamePipe implements PipeTransform {
	transform(month?: number): string {
		if (month !== undefined && month >= 0 && month <= 11) {
			return shortMonthNamesByNumber[month];
		}
		return '' + month;
	}
}
