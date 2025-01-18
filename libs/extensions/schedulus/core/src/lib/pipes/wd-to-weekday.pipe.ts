import { Pipe, PipeTransform } from '@angular/core';
import { WeekdayCode2 } from '../dto';

export function wdCodeToWeekdayLongName(wd?: WeekdayCode2): string {
	switch (wd) {
		case 'mo':
			return 'Monday';
		case 'tu':
			return 'Tuesday';
		case 'we':
			return 'Wednesday';
		case 'th':
			return 'Thursday';
		case 'fr':
			return 'Friday';
		case 'sa':
			return 'Saturday';
		case 'su':
			return 'Sunday';
		default:
			return '' + wd;
	}
}

@Pipe({
	name: 'wdToWeekday',
})
export class WdToWeekdayPipe implements PipeTransform {
	transform(wd?: WeekdayCode2): string {
		return wdCodeToWeekdayLongName(wd);
	}
}
