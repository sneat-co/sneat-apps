import { getRelatedItemIDs } from '@sneat/dto';
import { WeekdayCode2, IHappeningContext } from '@sneat/mod-schedulus-core';

export interface ICalendarFilter {
	readonly text: string;
	readonly contactIDs: readonly string[];
	readonly weekdays: readonly WeekdayCode2[];
	readonly repeats: readonly string[];
	readonly showRecurrings: boolean;
	readonly showSingles: boolean;
}

// export function areSameFilters(f1: ICalendarFilter, f2: ICalendarFilter): boolean {
// 	return f1 === f2 || f1.text == f2.text && f1.memberIDs
//
// }

export function isMatchingScheduleFilter(
	h: IHappeningContext,
	f?: ICalendarFilter,
): boolean {
	if (!f) {
		return true;
	}
	if (f.text && !h.dbo?.title?.toLowerCase().includes(f.text)) {
		return false;
	}
	return !(
		f.contactIDs.length &&
		!f.contactIDs.some(
			(fmID) =>
				fmID === '' &&
				!getRelatedItemIDs(
					h.dbo?.related || h.brief?.related,
					'contactus',
					'contacts',
					h.team.id,
				).length,
		)
	);
}
