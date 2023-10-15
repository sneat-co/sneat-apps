import { WeekdayCode2 } from '@sneat/dto';
import { IHappeningContext } from '@sneat/team/models';

export interface IScheduleFilter {
	readonly text: string;
	readonly contactIDs?: string[];
	readonly weekdays?: WeekdayCode2[];
	readonly repeats?: string[];
	readonly showRecurrings: boolean;
	readonly showSingles: boolean;
}

// export function areSameFilters(f1: IScheduleFilter, f2: IScheduleFilter): boolean {
// 	return f1 === f2 || f1.text == f2.text && f1.memberIDs
//
// }

export function isMatchingScheduleFilter(
	h: IHappeningContext,
	f?: IScheduleFilter,
): boolean {
	if (!f) {
		return true;
	}
	if (f.text && !h.dto?.title?.toLowerCase().includes(f.text)) {
		return false;
	}
	if (
		f.contactIDs?.length &&
		!f.contactIDs.some(
			(fmID) =>
				(fmID === '' && !Object.keys(h.dto?.participants || {}).length) ||
				h.dto?.contactIDs?.some((hmID) => hmID == fmID),
		)
	) {
		return false;
	}
	return true;
}
