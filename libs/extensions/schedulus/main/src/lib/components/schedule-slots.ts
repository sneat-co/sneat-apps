import { ISlotItem } from '@sneat/extensions/schedulus/shared';
import { IScheduleFilter } from './schedule-filter/schedule-filter';

export function hasMember(
	item: { memberIDs?: string[] } | undefined,
	memberIDs?: string[],
): boolean {
	return (
		!memberIDs?.length ||
		!!item?.memberIDs?.some((id) => memberIDs.includes(id))
	);
}

// noinspection JSMethodCanBeStatic

// export function hasWeekday(slots: IHappeningSlot[] | undefined, weekdays?: WeekdayCode2[]): boolean {
// 	return !weekdays || !!slots?.some(slot => slot.weekdays?.some(wd => weekdays.includes(wd)));
// }

export function isSlotVisible(
	slot: ISlotItem,
	filter: IScheduleFilter,
): boolean {
	const { happening } = slot;
	const { memberIDs, repeats } = filter;
	if (happening?.brief && !hasMember(happening?.brief, memberIDs)) {
		return false;
	}
	// if (!hasWeekday(happening?.brief?.slots || happening?.dto?.slots, weekdays)) {
	// 	return false;
	// }
	if (
		repeats?.length &&
		!happening?.brief?.slots?.some((slot) => repeats.includes(slot.repeats))
	) {
		return false;
	}

	return (
		((!!slot.happening && filter.showRecurrings) ||
			(!!slot.happening && filter.showSingles)) &&
		(!filter ||
			slot.title.toLowerCase().indexOf(filter.text) >= 0 ||
			(!!slot.participants &&
				slot.participants.some(
					(participant) =>
						participant.title.toLowerCase().indexOf(filter.text) >= 0,
				)))
	);
}
