import { getWd2, wdCodeToWeekdayLongName } from '@sneat/mod-schedulus-core';
import { SpaceDaysProvider } from '../services/space-days-provider';
import { Weekday } from './calendar/weekday';

export function createWeekday(
	date: Date,
	spaceDaysProvider: SpaceDaysProvider,
): Weekday {
	const id = getWd2(date);
	return {
		id,
		longTitle: wdCodeToWeekdayLongName(id),
		day: spaceDaysProvider.getSpaceDay(date),
	};
}
