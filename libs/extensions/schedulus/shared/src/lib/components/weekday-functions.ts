import { getWd2, wdCodeToWeekdayLongName } from '@sneat/mod-schedulus-core';
import { CalendarDataProvider } from '../services/calendar-data-provider';
import { Weekday } from './calendar/weekday';

export function createWeekday(
	date: Date,
	spaceDaysProvider: CalendarDataProvider,
): Weekday {
	const id = getWd2(date);
	const day = spaceDaysProvider.getCalendarDay(date);
	const weekday: Weekday = {
		id,
		day,
		longTitle: wdCodeToWeekdayLongName(id),
	};
	console.log('createWeekday();', date, spaceDaysProvider, weekday);
	return weekday;
}
